#include <WiFiUdp.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <DHT.h>

// Include the config file
#include "config.hpp"

// DHT sensor instance
DHT dht(DHTPIN, DHTTYPE, 6);

// Time server
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, ntp_server, utcOffsetInSeconds);

// The json element
DynamicJsonDocument doc(1024);

// The wifi client
ESP8266WiFiMulti WiFiMulti;

/**
 * Setup steps
 */
void setup() {
  Serial.begin(9600);

  // initialize measuring
  pinMode(DHTPIN, INPUT);
  dht.begin();

  // Connect to the wifi
  connectWifi();
  timeClient.begin();
}

/**
   Connect to the wifi
*/
void connectWifi() {
  Serial.println("Connecting to ");
  Serial.println(ssid);

  // Connect to wifi
  WiFi.mode(WIFI_STA);
  WiFi.hostname(hostname);
  WiFiMulti.addAP(ssid, password);

  // Try connecting
  int retries = 0;
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    retries++;

    // Sleep
    if (retries > 100) {
      Serial.println("Failed to connect. Sleeping for some time");
      sleep();
    }
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("");
}

/**
 * Convert an ip address to a string.
 * Source: https://forum.arduino.cc/t/how-to-manipulate-ipaddress-variables-convert-to-string/222693/6
 * 
 * @param ipAddress the ip address to convert
 * @return the converted ip address
 */
String IpAddress2String(const IPAddress& ipAddress) {
  return String(ipAddress[0]) + String(".") + \
         String(ipAddress[1]) + String(".") + \
         String(ipAddress[2]) + String(".") + \
         String(ipAddress[3]);
}

/**
 * Convert an ip address string to a string
 *
 * @param url the url to convert
 * @return the converted url string
 */
String IpAddress2String(const char *url) {
  return String(url);
}

/**
 * Get the api connection url
 * 
 * @return the url
 */
String getApiUrl() {
  String url;
  if (ssl) {
    url = "https://";
  } else {
    url = "http://";
  }
  url += IpAddress2String(api_url);
  url += ':';
  url += api_port;
  url += "/api/v1/data/";
  url += sensor_id;

  return url;
}

/**
 * Send the data to the server
 */
void sendData() {
  Serial.print("Connecting to ");
  Serial.print(api_url);
  Serial.print(':');
  Serial.print(api_port);
  Serial.println("...");

  // Connect to the server
  WiFiClient client;
  if (client.connect(api_url, api_port)) {
    Serial.println("Successfully connected");
  } else {
    Serial.println("Could not connect");
    return;
  }

  // Get the api url
  const static String url = getApiUrl();
  Serial.print("Sending data to: ");
  Serial.println(url);

  // Connect to the server and set the headers
  HTTPClient http;
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + auth_token);

  // Serialize the data
  String payload;
  serializeJson(doc, payload);
  Serial.print("Sending data: ");
  Serial.println(payload);

  // Send the data
  int httpCode = http.PUT(payload);
  Serial.print("Response code: ");
  Serial.println(httpCode);
}

/**
 * Sleep for SLEEP_SECONDS seconds.
 * Uses deep sleep for sleeping
 */
void sleep() {
  Serial.print("Sleeping for ");
  Serial.print(SLEEP_SECONDS);
  Serial.println(" seconds");
  Serial.println("");

  ESP.deepSleep(SLEEP_SECONDS * 1000000);
}

/**
 * Read the sensor data into
 * the json data buffer
 */
void readData() {
  timeClient.update();
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  doc["timestamp"] = timeClient.getEpochTime();
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
}

/**
 * The main loop
 */
void loop() {
  readData();
  sendData();
  sleep();
}
