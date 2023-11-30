import * as React from 'react';
import { BottomNavigation, Text, useTheme } from 'react-native-paper';
import SettingsScreen from './settings';
import TrendsScreen from './trends';
import BudgetsScreen from './budgets';
import DashboardScreen from './dashboard';


const DashboardRoute = () => <DashboardScreen />;

const BudgetsRoute = () => <BudgetsScreen />;

const TrendsRoute = () => <TrendsScreen />;

const SettingsRoute = () => <SettingsScreen />;

const MyComponent = () => {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'dashboard', title: 'Dashboard', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'budgets', title: 'Budgets', focusedIcon: 'wallet', unfocusedIcon: 'wallet-outline' },
    { key: 'trends', title: 'Trends', focusedIcon: 'chart-areaspline', unfocusedIcon: 'chart-line' },
    { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: DashboardRoute,
    budgets: BudgetsRoute,
    trends: TrendsRoute,
    settings: SettingsRoute,
  });

  return (
    <BottomNavigation
    theme={{colors: {secondaryContainer: theme.colors.primaryContainer}}}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default MyComponent;