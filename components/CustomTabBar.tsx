import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Компонент кастомного TabBar с отдельными фоновыми изображениями для каждой вкладки
export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        
        const isFocused = state.index === index;
        
        // Выбираем фоновое изображение в зависимости от вкладки и её активности
        let backgroundImage;
        if (route.name === 'index') {
          backgroundImage = require('@/assets/images/bottom_panel.png');
        } else {
          // Для вкладки "Улучшения" используем другое изображение
          // Если его нет, используем то же изображение
          backgroundImage = require('@/assets/images/bottom_panel.png');
        }
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          
          if (!isFocused && !event.defaultPrevented) {
            // Навигация к этой вкладке
            navigation.navigate(route.name);
          }
        };
        
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        
        // Получаем иконку из опций вкладки
        const TabIcon = options.tabBarIcon as any;
        
        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <Image
              source={backgroundImage}
              style={styles.tabBackground}
              resizeMode="stretch"
            />
            <View style={styles.tabContent}>
              {TabIcon && 
                <TabIcon 
                  focused={isFocused} 
                  color={isFocused ? '#FFFFFF' : '#999999'} 
                />
              }
              <Text style={[
                styles.tabText,
                { color: isFocused ? '#FFFFFF' : '#999999' }
              ]}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'transparent',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});