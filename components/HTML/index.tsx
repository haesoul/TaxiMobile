import React from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

interface IProps {
  html?: string;
}

const HTML: React.FC<IProps> = ({ html = '' }) => {
  const { width } = useWindowDimensions();

  if (!html) return null;

  // Если нужно, можно удалять скрипты или теги, которые RN не поддерживает
  const sanitizedHtml = html.replace(/<script.*?>.*?<\/script>/gi, '');

  return (
    <ScrollView>
      <RenderHtml
        contentWidth={width}
        source={{ html: sanitizedHtml }}
        enableExperimentalMarginCollapsing={true}
        baseStyle={{ fontSize: 16, color: '#000' }}
      />
    </ScrollView>
  );
};

export default HTML;
