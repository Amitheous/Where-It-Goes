import { View, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Appbar, useTheme, Card, Text } from "react-native-paper";


export default function DashboardScreen() {
  const router = useRouter();
  // const expenses = useStoreState(AuthStore, s => s.expenses);
  // console.log(expenses)
  const theme = useTheme();
  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.colors.secondaryContainer
    },
    headerContent: {
      color: theme.colors.secondary
    },
    card: {
      backgroundColor: theme.colors.tertiaryContainer,
      fontFamily: 'Montserrat_400Regular',
    },
    cardText: {
      color: theme.colors.onTertiaryContainer,
      fontFamily: 'Montserrat_400Regular',
    }
  });

  const currentMonthSpend = "$500";
  const previousMonthSpend = "$400";
  const twoMonthsAgoSpend = "$300";

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={styles.header} >
        <Appbar.Content title="Dashboard"/>
      </Appbar.Header>
      <View>
        <Card style={styles.card}>
          <Card.Title titleVariant="titleMedium" title="Monthly Spend" titleStyle={styles.cardText} />
          <Card.Content>
            <Text style={styles.cardText}>Current Month Spend: {currentMonthSpend}</Text>
            <Text style={styles.cardText}>Previous Month Spend: {previousMonthSpend}</Text>
            <Text style={styles.cardText}>2 Months Ago Spend: {twoMonthsAgoSpend}</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}