#define BLYNK_TEMPLATE_ID "TMPL36AWMU8I8"
#define BLYNK_TEMPLATE_NAME "ParaMedix"
#define BLYNK_AUTH_TOKEN "qalMIkFVTWfE8Sqj2V9XV2gjdtjcp-yM"

#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <Wire.h>
#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include "MAX30100_PulseOximeter.h"

#define ONE_WIRE_BUS 18
#define LED_Status 5
#define RXD2 16  // GPS TX -> ESP32 RX
#define TXD2 17  // GPS RX -> ESP32 TX
#define REPORTING_PERIOD_MS 1000

const char* ssid = "xyz";
const char* password = "123";

PulseOximeter pox;
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);

TaskHandle_t poxTaskHandle;  
uint32_t tsLastReport = 0;

void poxTask(void *parameter) {
    while (1) {
        pox.update();
        vTaskDelay(1);
    }
}

void setup() {
    pinMode(LED_Status, OUTPUT);
    Serial.begin(115200);
    Wire.begin(21, 22);
    sensors.begin();
    gpsSerial.begin(9600, SERIAL_8N1, RXD2, TXD2);

    // Connect to WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi Connected");

    Blynk.begin(BLYNK_AUTH_TOKEN, ssid, password);

    if (!pox.begin()) {
        Serial.println("FAILED");
        for (;;);
    } else {
        Serial.println("MAX30100 Initialized");
    }

    pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);

    xTaskCreatePinnedToCore(
        poxTask, "poxTask", 2048, NULL, 1, &poxTaskHandle, 1
    );
}

void loop() {
    Blynk.run();

    // Blink LED only if ESP32 is connected to Blynk
    if (Blynk.connected()) {
        digitalWrite(LED_Status, HIGH);
        delay(500);
        digitalWrite(LED_Status, LOW);
        delay(500);
    } else {
        digitalWrite(LED_Status, LOW);
    }

    sensors.requestTemperatures();
    float tempC = sensors.getTempCByIndex(0);
    float tempF = sensors.getTempFByIndex(0);

    while (gpsSerial.available()) {
        gps.encode(gpsSerial.read());
    }

    float latitude,longitude, altitude;
    int gpsValid;

    if (gps.location.isValid()) {
        latitude = gps.location.lat();
        longitude = gps.location.lng();
        altitude = gps.altitude.meters();
        gpsValid = 1;
    }

    if (millis() - tsLastReport >= REPORTING_PERIOD_MS) {
        float heartrate = pox.getHeartRate();
        float spo2 = pox.getSpO2();

        Serial.printf("{%.2f,%.2f,%.6f,%.6f,%.2f,%d,%.2f,%.2f}\n",tempC, tempF, latitude, longitude, altitude, gpsValid, heartrate, spo2);

        // Send data to Blynk
        Blynk.virtualWrite(V0, heartrate);
        Blynk.virtualWrite(V1, spo2);
        Blynk.virtualWrite(V2, tempC);
        Blynk.virtualWrite(V3, tempF);
        Blynk.virtualWrite(V4, latitude);
        Blynk.virtualWrite(V5, longitude);
        Blynk.virtualWrite(V6, altitude);

        tsLastReport += REPORTING_PERIOD_MS;
    }

    vTaskDelay(10);
}

