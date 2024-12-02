import json
import csv
import warnings
warnings.filterwarnings('ignore')

import numpy as np
import pandas as pd
 
import matplotlib.pyplot as plt 
import seaborn as sns

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import normalize



#Write data in file Csv
#import dataSet
df = pd.read_csv('C:\\Users\\Asus\\Desktop\\KHOAPHAM\\python\\data.csv', encoding='utf-8')
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
plt.figure(figsize = (12,6))
df['rating'].value_counts(1).plot(kind='bar')
plt.show()

#Number of unique user_id and product_id in the data
print("Number of unique USERS in Raw data =", df["user_id"].nunique())
print("Number of unique ITEMS in Raw data =", df["product_id"].nunique())

#Top ten users based on rating
most_rated = df.groupby("user_id").size().sort_values(ascending=False)[:10]
#Group by userId and count rows of each Users , this is a size(), and then it sort from the largest to smallest , and get 10 user in there
print(most_rated)

# if user has 2 rating (means has 2 rows data in dataFrame), this will be removed from the matrix. if not , this user lead to the matrix will be not true, because the matrix is not thick.This is filteing Data
counts = df["user_id"].value_counts()
df_final = df[df["user_id"].isin(counts[counts >= 2].index)]
#after Filtering Data
print('The number of observations in the final data =', len(df_final))
print("The number of unique USERS in the final data = " , df["user_id"].nunique())
print("The number of unique PRODUCTS in the final data = " , df["product_id"].nunique())

#Creating the interaction matrix of products and users based on ratings and replacing NaN value with 0
final_ratings_matrix = df_final.pivot(index = 'user_id', columns ='product_id', values = 'rating').fillna(0)
print('Shape of final_ratings_matrix: ', final_ratings_matrix.shape)

#Finding the number of non-zero entries in the interaction matrix 
given_num_of_ratings = np.count_nonzero(final_ratings_matrix)
print('given_num_of_ratings = ', given_num_of_ratings)

#Finding the possible number of ratings as per the number of users and products
possible_num_of_ratings = final_ratings_matrix.shape[0] * final_ratings_matrix.shape[1]
print('possible_num_of_ratings = ', possible_num_of_ratings)


#UserId is a Object data type. So we will replace the user_id by numbers from 0 to 1539(for all userIds).
final_ratings_matrix['user_index'] = np.arange(0, final_ratings_matrix.shape[0])
final_ratings_matrix.set_index(['user_index'], inplace=True)

# Actual ratings given by users
print(final_ratings_matrix.head())


# and now, we will change the matrix into the Normalize Rating matrix ( by use per value of vector is subtracted for mean() of vector value) 
#normalize rows of matrix

#calculate the mean Row of the matrix
row_means = final_ratings_matrix.mean(axis=1)
# Normalize matrix :
def normalize_row(row, mean):
    return row.apply(lambda x: x - mean if x != 0 else x)
# Apply normalize_row for per row in Matrix
normalized_matrix = final_ratings_matrix.apply(lambda row: normalize_row(row, row_means[row.name]), axis=1)

print("NORMALIZE_MATRIX")
print(normalized_matrix.head())

#create a copy normalize_matrix
similarity_matrix = pd.DataFrame(index=normalized_matrix.index, columns=normalized_matrix.index)
#defining a function to get similar user
def calculate_similarity_matrix(normalized_matrix):    
    for i in range(normalized_matrix.shape[0]):
        for j in range(normalized_matrix.shape[0]):
            if i != j:
                sim = cosine_similarity([normalized_matrix.iloc[i]], [normalized_matrix.iloc[j]])[0][0] #return matrix 2D so that we [0][0] to get sim() of there. shape of 2D : [[0.9922]]
                similarity_matrix.iloc[i, j] = sim
            else:
                similarity_matrix.iloc[i, j] = 1.0  
    return similarity_matrix

similarity_matrix = calculate_similarity_matrix(normalized_matrix)

print(similarity_matrix.head(5))

def top_sim_user(user_index, similarity_matrix, k=5):
    user_similiar = similarity_matrix.iloc[user_index]
    user_similiar_list = user_similiar.sort_values(ascending=False).drop(user_index)
    top_similiar_user = user_similiar_list.head(k)
    return top_similiar_user

print(top_sim_user(0,similarity_matrix,5))
# print(normalized_matrix.head(8))
# similarity_matrix.head()

def ppredict_ratings_matrix(normalized_matrix, similarity_matrix, k=2):
    n_users, n_items = normalized_matrix.shape
    predicted_ratings = normalized_matrix.copy().values  # Copy the matrix to keep original ratings
    for user_index in range(n_users):
        for item_index in range(n_items):
            if(normalized_matrix.iloc[user_index,item_index] != 0): continue
            else:
                numerator = 0
                denominator = 0
                for index,value in top_sim_user(user_index,similarity_matrix,k).items():
                    numerator += value * normalized_matrix.iloc[index,item_index]
                    denominator += abs(value)
                if denominator == 0 :
                    predicted_ratings[user_index, item_index] = 0
                else: 
                    predicted_ratings[user_index, item_index] = numerator / denominator
    return predicted_ratings

predict_ratings_matrix = pd.DataFrame(ppredict_ratings_matrix(normalized_matrix, similarity_matrix,2))
print(predict_ratings_matrix.head(3))

# user_rating = final_ratings_matrix.loc[0,:]
# user_predict = predict_ratings_matrix.loc[0,:]
# print(user_predict)
# print(user_rating)
# def recommender_product(user_index,final_ratings_matrix,predict_ratings_matrix,n_product):
#     user_rating = final_ratings_matrix.loc[user_index,:]
#     user_predict = predict_ratings_matrix.loc[user_index,:]
#     temp = pd.DataFrame({'user_rating' : user_rating, 'user_predict' :user_predict})
#     temp = temp.loc[temp.user_ratings == 0] 





