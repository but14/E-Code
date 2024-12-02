import csv
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

# Dữ liệu JSON đã sửa đổi
data = {
  "Hoa hồng": {
    "product_id": 1,
    "Màu sắc": "Đỏ",
    "Mùa nở": "Mùa xuân",
    "Mùi hương": "Thơm",
    "Kích thước": "Trung bình",
    "Phân loại": "Hoa cắt cành",
    "Giá bán": 100000,
    "rating" : 3.3
  },
  "Hoa lan": {
    "product_id": 2,
    "Màu sắc": "Vàng",
    "Mùa nở": "Mùa hè",
    "Mùi hương": "Thơm",
    "Kích thước": "Lớn",
    "Phân loại": "Hoa chậu",
    "Giá bán": 200000,
    "rating" : 2.3

  },
  "Hoa cúc": {
    "product_id": 3,
    "Màu sắc": "Trắng",
    "Mùa nở": "Mùa thu",
    "Mùi hương": "Không có",
    "Kích thước": "Nhỏ",
    "Phân loại": "Hoa bó",
    "Giá bán": 150000,
    "rating" : 1.0

  },
  "Hoa huệ": {
    "product_id": 4,
    "Màu sắc": "Tím",
    "Mùa nở": "Mùa đông",
    "Mùi hương": "Thơm nhẹ",
    "Kích thước": "Trung bình",
    "Phân loại": "Hoa cắt cành",
    "Giá bán": 120000,
    "rating" : 4.5

  },
  "Hoa đồng tiền": {
    "product_id": 5,
    "Màu sắc": "Cam",
    "Mùa nở": "Mùa xuân",
    "Mùi hương": "Dịu nhẹ",
    "Kích thước": "Trung bình",
    "Phân loại": "Hoa bó",
    "Giá bán": 130000,
    "rating" : 5.0

  }
}

# Mở file CSV với mã hóa UTF-8 để ghi
with open('flowers.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    
    # Viết tiêu đề cột
    writer.writerow(["Loại hoa", "product_id", "Màu sắc", "Mùa nở", "Mùi hương", "Kích thước", "Phân loại", "Giá bán","rating"])
    
    # Viết dữ liệu
    for flower, attributes in data.items():
        writer.writerow([flower] + list(attributes.values()))

print("CSV file created successfully!")

# Đọc tệp CSV
df = pd.read_csv('flowers.csv', encoding='utf-8')

# Kết hợp các đặc điểm thành một cột văn bản
df['combined_features'] = df.apply(lambda row: ' '.join(row.values.astype(str)), axis=1)

# Tính toán ma trận TF-IDF
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(df['combined_features'])

# Hiển thị ma trận TF-IDF
print("TF-IDF Matrix:")
print(tfidf_matrix.toarray())

# Hiển thị các từ
print("Features names:")
print(vectorizer.get_feature_names_out())
