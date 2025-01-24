import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
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

# Evaluate the model
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# Save the model for real-time prediction
joblib.dump(model, "random_forest_shock_model.pkl")

# Example real-time prediction
example_data = {
    "location": "Home",
    "expected_location": "Gym",
    "movement": 200,
    "expected_movement": 100,
    "health_data": "Normal",
    "expected_health_data": "Active",
    "website_visiting": "shopping.com",
    "productive": 1,
    "minutes_spent": 00,
    "steps_taken": 2000,
    "expected_steps": 2000
}

# Convert example data to DataFrame
example_df = pd.DataFrame([example_data])

# Encode categorical data in the example
for column, le in label_encoders.items():
    example_df[column] = le.transform(example_df[column])

# Predict
shock_prediction = model.predict(example_df)[0]

# Print the result and identify contributing variables
if shock_prediction == 1:
    # Feature importance
    feature_importances = model.feature_importances_
    feature_importance_df = pd.DataFrame({
        "Feature": X.columns,
        "Importance": feature_importances
    }).sort_values(by="Importance", ascending=False)

    print("Shock Needed: Yes")
    print("Top contributing variables:")
    print(feature_importance_df.head(3))  # Display the top 3 contributing variables
else:
    print("Shock Needed: No")
