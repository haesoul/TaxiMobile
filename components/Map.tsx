import React, { useEffect, useState } from "react";
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Region, UrlTile } from "react-native-maps";


interface MapInterface {
  region?: Region;
}

export default function OSMMap({ region }: MapInterface) {
  const [isFullscreen, setIsFullscreen] = useState(false);


  useEffect(() => {
    if (isFullscreen) {
      StatusBar.setHidden(true);
    } else {
      StatusBar.setHidden(false);
    }
  }, [isFullscreen])

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <View style={styles.container}>
      <MapView
        style={isFullscreen ? styles.mapFullscreen : styles.map}
        initialRegion={region}
        mapType="none"
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
      </MapView>

      <TouchableOpacity
        style={styles.fullscreenButton}
        onPress={toggleFullscreen}
      >
        <Text style={styles.buttonText}>
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: 300,
  },
  mapFullscreen: {
    width: width,
    height: height,
  },
  fullscreenButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
