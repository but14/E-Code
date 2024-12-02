import json
import csv
import warnings
warnings.filterwarnings('ignore')

import numpy as np
from sklearn.metrics import mean_squared_error
import pandas as pd
 
import matplotlib.pyplot as plt 
import seaborn as sns

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import normalize

from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds # for sparse matrices

from flask import Flask,jsonify,request


app = Flask(__name__)


#Write data in file Csv
#import dataSet
df = pd.read_csv('C:\\Users\\Asus\\Desktop\\KHOAPHAM\\WolfTech_api\\data.csv', encoding='utf-8')
df_copy = df.copy(deep=True)#copy the data to another dataFrame


rows, columns = df.shape
print("No of rows = " , rows)
print("No of columns = ", columns)
df.info()
#Finding the number of missing values in each columns and sum
df.isna().sum()
#Summary statistics of "rating" variable
df["rating"].describe()

#Create the plot and provide observations
plt.figure(figsize = (13,6))
df['rating'].value_counts(1).plot(kind='bar')
#plt.show()

#Number of unique user_id and product_id in the data
print("Number of unique USERS in Raw data =", df["user_id"].nunique())
print("Number of unique ITEMS in Raw data =", df["product_id"].nunique())

#Top ten users based on rating
most_rated = df.groupby("user_id").size().sort_values(ascending=False)[:10]
#Group by userId and count rows of each Users , this is a size(), and then it sort from the largest to smallest , and get 10 user in there
print(most_rated)

# if user has 2 rating (means has 2 rows data in dataFrame), this will be removed from the matrix. if not , this user lead to the matrix will be not true, because the matrix is not thick.This is filteing Data
counts = df["user_id"].value_counts()
df_final = df[df["user_id"].isin(counts[counts >= 0].index)]
#after Filtering Data
print('The number of observations in the final data =', len(df_final))
print("The number of unique USERS in the final data = " , df["user_id"].nunique())
print("The number of unique PRODUCTS in the final data = " , df["product_id"].nunique())

#Creating the interaction matrix of products and users based on ratings and replacing NaN value with 0
final_ratings_matrix = df_final.pivot(index = 'user_id', columns ='product_id', values = 'rating').fillna(0)
print('Shape of final_ratings_matrix: ', final_ratings_matrix.shape)

#Normalize matrix rating ->

#Finding the number of non-zero entries in the interaction matrix 
given_num_of_ratings = np.count_nonzero(final_ratings_matrix)
print('given_num_of_ratings = ', given_num_of_ratings)

#Finding the possible number of ratings as per the number of users and products
possible_num_of_ratings = final_ratings_matrix.shape[0] * final_ratings_matrix.shape[1]
print('possible_num_of_ratings = ', possible_num_of_ratings)

# Normalize matrix :
row_means = final_ratings_matrix.mean(axis=1)
def normalize_row(row, mean):
    return row.apply(lambda x: x - mean if x != 0 else x)
# Apply normalize_row for per row in Matrix
normalized_matrix = final_ratings_matrix.apply(lambda row: normalize_row(row, row_means[row.name]), axis=1)
print(normalized_matrix.head(10))


############################# MODEL_COLABORATIVE - MATRIX FACTORIZATION
final_ratings_sparse = csr_matrix(normalized_matrix.values)
# Singular Value Decomposition
print(final_ratings_sparse)
#U, s, Vt = svds(final_ratings_sparse, k = 5)
 # here k is the number of latent features - Những đặc trưng này không thể quan sát trực tiếp nhưng được suy ra từ các mẫu trong dữ liệu.

U, s, Vt = svds(final_ratings_sparse, k=min(final_ratings_sparse.shape)-1)
explained_variance = np.cumsum(s[::-1] ** 2) / np.sum(s ** 2)
k = np.argmax(explained_variance >= 0.9) + 1
print(f'Số lượng đặc trưng ẩn tối ưu: {k}')
U, s, Vt = svds(final_ratings_sparse, k=k)


# Construct diagonal array in SVD
sigma = np.diag(s)
U.shape
sigma.shape
Vt.shape

all_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt) 

# Predicted ratings
preds_df = pd.DataFrame(abs(all_user_predicted_ratings), columns = final_ratings_matrix.columns)
preds_df.head()
preds_matrix = csr_matrix(preds_df.values)
#print(preds_df.head(3))

user_row_map = {user_id: idx for idx, user_id in enumerate(final_ratings_matrix.index)}


def recommend_items(user_index, interactions_matrix, preds_matrix, num_recommendations, user_row_map):
    # Tìm chỉ số hàng tương ứng với user_index
    if user_index not in user_row_map:
        raise IndexError(f'User ID ({user_index}) is not in the user_row_map.')
    
    user_row = user_row_map[user_index]

    # Get the user's ratings from the actual and predicted interaction matrices
    user_ratings = interactions_matrix[user_row,:].toarray().reshape(-1)
    user_predictions = preds_matrix[user_row,:].toarray().reshape(-1)

    # Creating a dataframe with actual and predicted ratings columns
    temp = pd.DataFrame({'user_ratings': user_ratings, 'user_predictions': user_predictions})
    temp['Recommended Products'] = np.arange(len(user_ratings))
    temp = temp.set_index('Recommended Products')
    
    # Filtering the dataframe where actual ratings are 0 which implies that the user has not interacted with that product
    temp = temp.loc[temp.user_ratings == 0]   
    
    # Recommending products with top predicted ratings
    temp = temp.sort_values('user_predictions', ascending=False)  # Sort the dataframe by user_predictions in descending order
    recommended_products = temp.head(num_recommendations).index.tolist()
    return recommended_products

#Enter 'user index' and 'num_recommendations' for the user
#print(recommend_items(2,final_ratings_sparse,preds_matrix,5))

rmse_all = np.sqrt(mean_squared_error(normalized_matrix, preds_df))
print(f'RMSE cho tất cả các phần tử: {rmse_all:.4f}')

################### RANK BASE RATING : final_rating
#calculate the average rating for each product
average_rating = df_final.groupby('product_id').mean()["rating"]
#Calculate the count of rating for each product
count_rating = df_final.groupby('product_id').count()['rating']
#Create a dataFrame with calculated average and count of ratings
final_rating = pd.DataFrame({'avg_rating' : average_rating, 'rating_count': count_rating})
#Sort the dataFrame by average of rating
final_rating = final_rating.sort_values(by='avg_rating', ascending=False)
#print(final_rating)
#final_ratings_matrix

def top_n_products(n):
    recommendations = final_rating.groupby('avg_rating',group_keys=False,sort=False).apply(lambda x: x.sort_values('rating_count', ascending=False)).reset_index(drop=False)
    #print(recommendations)
    top_n = recommendations.head(n)
    product_ids = top_n['product_id'].tolist()
    return product_ids

#print(top_n_products(5))



########################## COLABORATIVE (USER-USER)

## recommender_product()






@app.route('/api/rank_base', methods=['POST'])
def rank_base():
    data = request.get_json()
    n_product = data.get("n_product")
    if n_product is None :
        return jsonify({"error":"Missing required parameters"}),400
    top_product = top_n_products(n_product)
    return jsonify({'data': top_product})

@app.route('/api/model_cola',methods=["POST"])
def model_cola():
    data = request.get_json()
    user_index = data.get("user_index")
    num_recommender = data.get("num_recommender")
    if user_index is None or num_recommender is None:
        return jsonify({"error": "Missing required parameters"}), 400
    # Tạo từ điển mapping từ user_id sang chỉ số hàng
    user_row_map = {user_id: idx for idx, user_id in enumerate(final_ratings_matrix.index)}
    recommendations = recommend_items(user_index, final_ratings_sparse, preds_matrix, num_recommender, user_row_map)
    return jsonify({
        "user_index" : user_index,
        "recommend_items" : recommendations
    })


# route : classify User is logining,
# if user has 2 rating , its means "this is new User, so that we will apply rank_base for this , and if has > 2 rating will aplly cola_model"
# and not logining, wil apply rankbase, and limit product, we must force users to login, rating product.


if __name__ == '__main__':
    app.run(debug=True)

