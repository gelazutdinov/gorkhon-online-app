import { gql } from '@apollo/client';

// Координаты Горхона (Забайкальский край)
export const GORKHON_COORDINATES = {
  lat: 51.8244,  // Координаты Горхона
  lon: 107.6178
};

export const GET_WEATHER = gql`
  query Weather($lat: Float!, $lon: Float!) {
    weatherByPoint(request: { lat: $lat, lon: $lon }) {
      now {
        c: temperature
        f: temperature(unit: FAHRENHEIT)
        icon(format: SVG)
        description
        humidity
        windSpeed
        pressure
        visibility
      }
      forecast {
        hours(first: 48) {
          edges {
            node {
              timestamp
              temperature
              icon(format: SVG)
              description
            }
          }
        }
        days(first: 5) {
          edges {
            node {
              date
              temperatureMax
              temperatureMin
              icon(format: SVG)
              description
            }
          }
        }
      }
    }
  }
`;

// Типы для TypeScript
export interface WeatherData {
  weatherByPoint: {
    now: {
      c: number;
      f: number;
      icon: string;
      description: string;
      humidity: number;
      windSpeed: number;
      pressure: number;
      visibility: number;
    };
    forecast: {
      hours: {
        edges: Array<{
          node: {
            timestamp: string;
            temperature: number;
            icon: string;
            description: string;
          };
        }>;
      };
      days: {
        edges: Array<{
          node: {
            date: string;
            temperatureMax: number;
            temperatureMin: number;
            icon: string;
            description: string;
          };
        }>;
      };
    };
  };
}