// src/components/charts/GroupSpendingChart.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { Text } from '../ui/Text'; // Your custom Text component
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

interface DailyTotal {
    date: string; // Format like 'MM/DD' or 'D'
    total: number;
}

interface GroupSpendingChartProps {
    data: DailyTotal[];
    isLoading?: boolean;
    height?: number;
    width?: number;
}

const screenWidth = Dimensions.get('window').width;

export const GroupSpendingChart: React.FC<GroupSpendingChartProps> = ({
                                                                          data,
                                                                          isLoading = false,
                                                                          height = 220,
                                                                          width = screenWidth - 32, // Default width with padding
                                                                      }) => {
    if (isLoading) {
        return (
            <View style={[styles.container, { height }]}>
                <ActivityIndicator color={COLORS.textSecondary} />
            </View>
        );
    }

    if (!data || data.length === 0) {
        return (
            <View style={[styles.container, { height }]}>
                <Text variant="footnote" color={COLORS.textSecondary}>
                    Not enough data to display chart.
                </Text>
            </View>
        );
    }

    // Ensure at least two data points for a line chart
    const chartData = data.length === 1 ? [...data, data[0]] : data;

    const labels = chartData.map(item => item.date);
    const dataset = chartData.map(item => item.total);

    const chartConfig: AbstractChartConfig = {
        backgroundGradientFrom: COLORS.background, // Match screen background
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: COLORS.background,
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(${parseInt(COLORS.textPrimary.slice(1, 3), 16)}, ${parseInt(COLORS.textPrimary.slice(3, 5), 16)}, ${parseInt(COLORS.textPrimary.slice(5, 7), 16)}, ${opacity})`, // Primary text color
        labelColor: (opacity = 1) => `rgba(${parseInt(COLORS.textSecondary.slice(1, 3), 16)}, ${parseInt(COLORS.textSecondary.slice(3, 5), 16)}, ${parseInt(COLORS.textSecondary.slice(5, 7), 16)}, ${opacity})`, // Secondary text color
        strokeWidth: 2, // Line thickness
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // Optional: if you define colors in datasets
        propsForDots: {
            r: '4', // Dot radius
            strokeWidth: '1',
            stroke: COLORS.primaryAccent, // Accent color for dots
        },
        propsForLabels: { // Style labels using TYPOGRAPHY
            fontSize: TYPOGRAPHY.caption1.fontSize,
            fontFamily: TYPOGRAPHY.monoFootnote.fontFamily, // Use monospace for dates
        },
    };

    return (
        <View style={styles.container}>
            <LineChart
                data={{
                    labels: labels,
                    datasets: [
                        {
                            data: dataset,
                            color: (opacity = 1) => COLORS.textPrimary, // Line color
                            strokeWidth: 1.5, // Line width
                        },
                    ],
                    // legend: ["Total Spending"] // Optional legend
                }}
                width={width}
                height={height}
                yAxisLabel="$" // Or your currency symbol
                yAxisSuffix=""
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={chartConfig}
                bezier // Use curved lines
                style={styles.chart}
                withVerticalLabels={true} // Show X-axis labels (dates)
                withHorizontalLabels={false} // Hide Y-axis labels
                withInnerLines={false} // Hide grid lines
                withOuterLines={false} // Hide outer frame lines
                withShadow={false} // No shadow under the line
                fromZero={true} // Start Y-axis at 0
                // formatYLabel={() => ''} // Hide Y-axis labels completely if needed
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        // Add margin or padding as needed in the parent component
    },
    chart: {
        marginVertical: 8,
        borderRadius: 0, // Sharp corners
    },
});

