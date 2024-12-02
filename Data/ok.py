import numpy as np
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds

# Giả sử normalized_matrix là ma trận đã được normalize
normalized_matrix = csr_matrix([
    [0.5, 0.5, -1.0, 0.0],
    [1.5, -0.5, -1.0, 0.0],
    [2.0, 1.0, -2.0, -1.0],
    [0.0, 0.0, 0.0, 0.0]
])

# Thực hiện SVD
U, s, Vt = svds(normalized_matrix, k=2)

# Tạo ma trận chéo từ vector s
sigma = np.diag(s)

# Nhân ma trận U, sigma, và Vt để tạo ma trận dự đoán
predicted_ratings = np.dot(np.dot(U, sigma), Vt)

print("Ma trận U:")
print(U)
print("\nMa trận Sigma:")
print(sigma)
print("\nMa trận Vt:")
print(Vt)
print("\nMa trận dự đoán:")
print(predicted_ratings)
