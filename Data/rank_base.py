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


#Write data in file Csv
#import dataSet
df = pd.read_csv('C:\\Users\\Asus\\Desktop\\KHOAPHAM\\WolfTech_api\\data.csv', encoding='utf-8')
# df = pd.read_csv('C:\\Users\\Asus\\Desktop\\KHOAPHAM\\WolfTech_api\\data.csv', encoding='utf-8')
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
df_final = df[df["user_id"].isin(counts[counts >= 0].index)]
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


############ MATRIX FOR CALCULATE RANK BASE RATING : final_rating
#calculate the average rating for each product
average_rating = df_final.groupby('product_id').mean()["rating"]
#Calculate the count of rating for each product  
count_rating = df_final.groupby('product_id').count()['rating']
#Create a dataFrame with calculated average and count of ratings
final_rating = pd.DataFrame({'avg_rating' : average_rating, 'rating_count': count_rating})
#Sort the dataFrame by average of rating
final_rating = final_rating.sort_values(by='avg_rating', ascending=False)


print(final_rating)
final_ratings_matrix

def top_n_products(n):
    recommendations = final_rating.groupby('avg_rating',group_keys=False,sort=False).apply(lambda x: x.sort_values('rating_count', ascending=False)).reset_index(drop=False)
    print(recommendations)
    top_n = recommendations.head(n)
    product_ids = top_n['product_id'].tolist()
    return product_ids

print(top_n_products(20))



############ MATRIX FOR CALCULATE SIMILARITY USER  : final_ratings_matrix

