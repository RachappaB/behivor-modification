import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load data from 1.csv
df = pd.read_csv("1.csv")

# Encode categorical variables
label_encoders = {}
categorical_columns = ["location", "expected_location", "health_data", "expected_health_data", "website_visiting"]

for column in categorical_columns:
    le = LabelEncoder()
    df[column] = le.fit_transform(df[column])
    label_encoders[column] = le

# Define features and target
X = df.drop(columns=["shock", "time"])  # Drop "time" as it may not influence directly
y = df["shock"]

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model and label encoders
joblib.dump(model, "shock_prediction_model.pkl")
joblib.dump(label_encoders, "label_encoders.pkl")

