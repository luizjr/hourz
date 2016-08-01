import { StyleSheet } from 'react-native';
import Color from './color';

const typographies = {
  display4: {
    fontSize: 112,
    fontWeight: '300',
    lineHeight: 120,
    color: Color.color.SecondText
  },
  display3: {
    fontSize: 56,
    fontWeight: '400',
    lineHeight: 60,
    color: Color.color.SecondText
  },
  display2: {
    fontSize: 45,
    fontWeight: '400',
    lineHeight: 48,
    color: Color.color.SecondText
  },
  display1: {
    fontSize: 34,
    fontWeight: '400',
    lineHeight: 40,
    color: Color.color.SecondText
  },
  headline: {
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
    color: Color.color.PrimaryText
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
    color: Color.color.PrimaryText
  },
  subhead: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: Color.color.PrimaryText
  },
  body2: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
    color: Color.color.PrimaryText
  },
  body1: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: Color.color.PrimaryText
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    color: Color.color.SecondText
  },
  menu: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 24,
    color: Color.color.PrimaryText
  },
  button: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
    color: Color.color.PrimaryText
  },
  code2: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    color: Color.color.PrimaryText
  },
  code: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: Color.color.PrimaryText
  },
}

module.exports = StyleSheet.create(typographies);
