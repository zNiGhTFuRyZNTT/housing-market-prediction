from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import traceback

app = Flask(__name__)
CORS(app)

# Load the saved models
try:
    linear_regression_model = joblib.load('linear_regression_new_model.pkl')
    random_forest_model = joblib.load('random_forest_new_model.pkl')
    kmeans_model = joblib.load('kmeans_new_model.pkl')
    knn_model = joblib.load('knn_new_model.pkl')
except Exception as e:
    print(f"Error loading models: {str(e)}")
    print(traceback.format_exc())

def preprocess_for_kmeans(data):
    cat_encoder = OneHotEncoder(handle_unknown='ignore')
    num_scaler = StandardScaler()

    cat_features = ['Suburb', 'Type', 'Regionname']
    encoded_cats = cat_encoder.fit_transform(data[cat_features]).toarray()
    
    num_features = ['Rooms', 'Propertycount', 'Distance']
    scaled_nums = num_scaler.fit_transform(data[num_features])
    
    all_features = np.hstack([scaled_nums, encoded_cats])
    
    if all_features.shape[1] < 383:
        padding = np.zeros((all_features.shape[0], 383 - all_features.shape[1]))
        all_features = np.hstack([all_features, padding])
    
    return all_features

def make_predictions(input_data):
    lr_predictions = linear_regression_model.predict(input_data)
    rf_predictions = random_forest_model.predict(input_data)
    kmeans_data = preprocess_for_kmeans(input_data)
    kmeans_clusters = kmeans_model.predict(kmeans_data)
    knn_classes = knn_model.predict(input_data)
    
    return lr_predictions[0], rf_predictions[0], kmeans_clusters[0], knn_classes[0]

@app.route('/predict', methods=['POST', 'OPTIONS', "GET"])
def predict():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        # Get data from request
        data = request.get_json()
        
        # Convert to DataFrame
        input_df = pd.DataFrame({
            'Suburb': [data['Suburb']],
            'Rooms': [data['Rooms']],
            'Type': [data['Type']],
            'Propertycount': [data['Propertycount']],
            'Distance': [data['Distance']],
            'Regionname': [data['Regionname']]
        })
        
        # Make predictions
        lr_pred, rf_pred, kmeans_cluster, knn_class = make_predictions(input_df)
        
        # Format price predictions (assuming predictions are in millions)
        lr_price = f"${lr_pred*1000000:,.2f}"
        rf_price = f"${rf_pred*1000000:,.2f}"
        
        # Prepare response
        response = {
            'Linear_Regression_Price_Prediction': lr_price,
            'Random_Forest_Price_Prediction': rf_price,
            'K_Means_Cluster': int(kmeans_cluster),
            'KNN_Price_Category': str(knn_class)
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error making prediction: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)