#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <Wire.h>
#include <Adafruit_MLX90614.h> // Including the MLX90614 sensor library
#include "time.h" 

// Addons for handling token generation and RTDB payloads
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// WiFi credentials
#define WIFI_SSID "saadyu"
#define WIFI_PASSWORD "qwertyui"

// Firebase project API Key
#define API_KEY "AIzaSyDLF_zhyKu4cobqnMsCFIICrayer-1sQMo"

// Firebase authentication details
#define USER_EMAIL "twotyred@gmail.com"
#define USER_PASSWORD "twotyred"

// Firebase Realtime Database URL
#define DATABASE_URL "https://top-tyre-default-rtdb.asia-southeast1.firebasedatabase.app"

// Firebase setup
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// User UID
String uid;

// Database path, updated in setup
String databasePath;
// Paths for storing data
String tempPath = "/temperature";
String pressurePath = "/pressure";
String timePath = "/timestamp";

// Path for the current data entry
String parentPath;

int timestamp;
FirebaseJson json;

const char* ntpServer = "pool.ntp.org";

// MLX90614 sensor instance
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
float temperature;

// Pressure data from Arduino
float pressure = 0  ;

// Timing variables (update every 5 seconds)
unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 5000;

// Initialize the MLX90614 sensor
void initMLX90614() {
  if (!mlx.begin()) {
    Serial.println("MLX90614 sensor not found. Check your wiring.");
    while (1); // Halt execution
  }
}

// Connect to WiFi
void initWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println("Connected: " + WiFi.localIP().toString());
}

// Get current epoch time
unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return 0;
  }
  time(&now);
  return now;
}

void setup() {
  Serial.begin(115200); // For debugging
  Serial2.begin(9600, SERIAL_8N1, 16, 17); // Serial communication with Arduino

  // Initialize MLX90614 sensor
  initMLX90614();
  initWiFi();
  configTime(0, 0, ntpServer);

  // Setup Firebase
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;

  Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);

  // Token callback
  config.token_status_callback = tokenStatusCallback; // Defined in addons/TokenHelper.h

  // Token generation retry
  config.max_token_generation_retry = 5;

  // Initialize Firebase
  Firebase.begin(&config, &auth);

  // Wait for user UID
  Serial.println("Retrieving User UID...");
  while (auth.token.uid == "") {
    Serial.print('.');
    delay(1000);
  }
  uid = auth.token.uid.c_str();
  Serial.println("User UID: " + uid);

  // Update database path
  databasePath = "/UsersData/" + uid + "/readings";
}

void loop() {

  // Send new readings if it's time
  if (Firebase.ready() && (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    // Get timestamp
    timestamp = getTime();
    Serial.println("Time: " + String(timestamp));

    // Read temperature
    temperature = mlx.readObjectTempC();
    Serial.println("Temperature: " + String(temperature));

    // Read pressure data
    if (Serial2.available() > 0) {
      pressure = Serial2.parseFloat();
      Serial.println("Pressure: " + String(pressure));
    }

    // Create a unique path for the data
    parentPath = databasePath + "/" + String(timestamp);

    // Prepare data for Firebase
    json.set(tempPath.c_str(), String(temperature));
    json.set(pressurePath.c_str(), String(pressure));
    json.set(timePath.c_str(), String(timestamp));

    // Upload data to Firebase
    Serial.printf("Uploading data... %s\n", Firebase.RTDB.setJSON(&fbdo, parentPath.c_str(), &json) ? "Success" : fbdo.errorReason().c_str());
  }
}
