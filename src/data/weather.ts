import type { WeatherType, WeatherDef, WeatherPool } from '@/models/types'

export const WEATHER_DEFS: Record<WeatherType, WeatherDef> = {
  sunny:        { type: 'sunny',        name: '晴天',   emoji: '☀️', waterMultiplier: 1.0, slopeModifier: 1.0, speedModifier: 0 },
  cloudy:       { type: 'cloudy',       name: '多云',   emoji: '⛅', waterMultiplier: 1.0, slopeModifier: 1.0, speedModifier: 0 },
  light_rain:   { type: 'light_rain',   name: '小雨',   emoji: '🌧️', waterMultiplier: 1.1, slopeModifier: 1.2, speedModifier: 0 },
  heavy_fog:    { type: 'heavy_fog',    name: '浓雾',   emoji: '🌫️', waterMultiplier: 1.2, slopeModifier: 1.1, speedModifier: 0 },
  heavy_rain:   { type: 'heavy_rain',   name: '暴雨',   emoji: '⛈️', waterMultiplier: 1.3, slopeModifier: 1.3, speedModifier: 0 },
  thunderstorm: { type: 'thunderstorm', name: '雷暴',   emoji: '⚡', waterMultiplier: 1.3, slopeModifier: 1.3, speedModifier: 0 },
  light_snow:   { type: 'light_snow',   name: '小雪',   emoji: '🌨️', waterMultiplier: 1.3, slopeModifier: 1.5, speedModifier: 0 },
  blizzard:     { type: 'blizzard',     name: '暴风雪', emoji: '❄️', waterMultiplier: 1.5, slopeModifier: 2.0, speedModifier: -1 },
}

/** Winter: no rain/thunder; Summer: no snow/blizzard */
export const WEATHER_POOLS: Record<string, WeatherPool> = {
  winter: {
    season: 'winter',
    weights: {
      sunny: 5, cloudy: 10, light_rain: 0, heavy_fog: 20,
      heavy_rain: 0, thunderstorm: 0, light_snow: 30, blizzard: 35,
    },
  },
  summer: {
    season: 'summer',
    weights: {
      sunny: 10, cloudy: 20, light_rain: 20, heavy_fog: 20,
      heavy_rain: 18, thunderstorm: 12, light_snow: 0, blizzard: 0,
    },
  },
}

/** 天气连续性偏好：相似天气组 */
export const WEATHER_SIMILARITY: Record<WeatherType, WeatherType[]> = {
  sunny:        ['cloudy'],
  cloudy:       ['sunny', 'light_rain', 'heavy_fog'],
  light_rain:   ['cloudy', 'heavy_rain'],
  heavy_fog:    ['cloudy', 'light_snow'],
  heavy_rain:   ['light_rain', 'thunderstorm'],
  thunderstorm: ['heavy_rain'],
  light_snow:   ['heavy_fog', 'blizzard'],
  blizzard:     ['light_snow'],
}

export function getWeatherDef(type: WeatherType): WeatherDef {
  return WEATHER_DEFS[type]
}
