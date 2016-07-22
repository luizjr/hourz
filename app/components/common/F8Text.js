/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @providesModule F8Text
 * @flow
 */

'use strict';
import React, {Component} from 'react';
import {StyleSheet, Dimensions, Text} from 'react-native';
import F8Colors from 'F8Colors';

export class HText extends Component {
  render() {
    let componentStyles = [styles.font];
    return (
      <Text style={[...componentStyles, this.props.style]} {...this.props} />
    );
  }
}

export class Heading1 extends Component {
  componentStyles: [styles.font, styles.h1];
  render() {
    return (
      <Text style={[...this.componentStyles, style]} {...props} />
    );
  }
}

export class Paragraph extends Component {
  componentStyles: [styles.font, styles.p];
  render() {
    return (
      <Text style={[...this.componentStyles, style]} {...props} />
    );
  }
}

// export function Text({style, ...props}: Object): ReactElement {
//   return <React.Text style={[styles.font, style]} {...props} />;
// }
//
// export function Heading1({style, ...props}: Object): ReactElement {
//   return <React.Text style={[styles.font, styles.h1, style]} {...props} />;
// }
//
// export function Paragraph({style, ...props}: Object): ReactElement {
//   return <React.Text style={[styles.font, styles.p, style]} {...props} />;
// }

const scale = Dimensions.get('window').width / 375;

function normalize(size: number): number {
  return Math.round(scale * size);
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Graphik App',
  },
  h1: {
    fontSize: normalize(24),
    lineHeight: normalize(27),
    color: F8Colors.darkText,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  p: {
    fontSize: normalize(15),
    lineHeight: normalize(23),
    color: F8Colors.lightText,
  },
});
