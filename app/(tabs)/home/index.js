import * as React from 'react';
import { BottomNavigation, Text, useTheme } from 'react-native-paper';
import SettingsScreen from './settings';
import TrendsScreen from './trends';
import BudgetsScreen from './budgets';
import ExpensesScreen from './expenses';


const ExpensesRoute = () => <ExpensesScreen />;

const BudgetsRoute = () => <BudgetsScreen />;

const TrendsRoute = () => <TrendsScreen />;

const SettingsRoute = () => <SettingsScreen />;

const MainApp = () => {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'expenses', title: 'Expenses', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'budgets', title: 'Budgets', focusedIcon: 'wallet', unfocusedIcon: 'wallet-outline' },
    { key: 'trends', title: 'Trends', focusedIcon: 'chart-areaspline', unfocusedIcon: 'chart-line' },
    { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    expenses: ExpensesRoute,
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

export default MainApp;