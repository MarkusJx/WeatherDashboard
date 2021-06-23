// DHT definitions
#define DHTPIN D5         // pin of the arduino where the sensor is connected to
#define DHTTYPE DHT11     // define the type of sensor (DHT11 or DHT22)

// The delay between sending values in seconds
#define SLEEP_SECONDS (60 * 5)

// Whether to use ssl
const bool ssl = false;

// The hostname of this wifi client
const char *hostname = "<A hostname for this client>";

// WiFi credentials
const char* ssid = "<Your SSID>";
const char* password = "<Your WiFi password>";

// NTP server address
const char *ntp_server = "pool.ntp.org";

// The utc offset in seconds
const long utcOffsetInSeconds = 3600;

// The jwt authentication token
const String auth_token = "<Your token>";
// The id of this sensor
const int sensor_id = 0;

// Change to either use urls or ip addresses
//const char *api_url = "some_url.com";
IPAddress api_url(192, 168, 0, 42);
// The api port
const uint16_t api_port = 80;
