// src/components/charts/GroupSpendingChart.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import Svg, { Circle } from 'react-native-svg';
import { Text } from '../ui/Text';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

interface DailyTotal {
    date: string; // Format like 'M/D'
    total: number;
}

interface GroupSpendingChartProps {
    data: DailyTotal[];
    isLoading?: boolean;
    height?: number;
    width?: number;
    highlightIndex?: number;
}

const screenWidth = Dimensions.get('window').width;

export const GroupSpendingChart: React.FC<GroupSpendingChartProps> = ({
                                                                          data,
                                                                          isLoading = false,
                                                                          height = 120, // Minimal height
                                                                          width = screenWidth - 32, // Width accounting for 16px padding on each side
                                                                          highlightIndex,
                                                                      }) => {

    if (isLoading) {
        return (
            <View style={[styles.container, { height }]}>
                <ActivityIndicator color={COLORS.textSecondary} />
            </View>
        );
    }

    // Ensure data is valid and has at least two points for LineChart
    const isValidData = data && Array.isArray(data) && data.length >= 1;
    const chartDataInternal = !isValidData || data.length === 0
        ? { labels: [' ', ' '], datasets: [{ data: [0, 0], color: () => COLORS.transparent, strokeWidth: 0 }] } // Minimal dummy data for empty state
        : data.length === 1
            ? { labels: [data[0].date, ''], datasets: [{ data: [data[0].total, data[0].total] }] } // Duplicate point for line
            : { labels: data.map(item => item.date), datasets: [{ data: data.map(item => item.total) }] };

    const chartConfig: AbstractChartConfig = {
        backgroundGradientFrom: COLORS.background,
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: COLORS.background,
        backgroundGradientToOpacity: 1,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.8})`, // Dark grey line/dots
        labelColor: (opacity = 1) => `rgba(${parseInt(COLORS.textSecondary.slice(1, 3), 16)}, ${parseInt(COLORS.textSecondary.slice(3, 5), 16)}, ${parseInt(COLORS.textSecondary.slice(5, 7), 16)}, ${opacity})`,
        strokeWidth: 1, // Thin line
        propsForDots: { // Base dot style (overridden below)
            r: '3',
            fill: COLORS.textPrimary,
        },
        propsForBackgroundLines: { // Vertical dashed lines
            strokeDasharray: '2, 4', // Adjust dash pattern
            stroke: COLORS.border,
            strokeWidth: StyleSheet.hairlineWidth,
        },
        propsForLabels: {
            fontSize: TYPOGRAPHY.caption2.fontSize, // Smallest caption size
            fontFamily: TYPOGRAPHY.monoFootnote.fontFamily,
            fill: COLORS.textSecondary,
        },
        decimalPlaces: 0, // No decimals on tooltips if shown
    };

    // Custom dot rendering
    const renderDot = ({ x, y, index }: { x: number; y: number; index: number }) => {
        if (!isValidData || data.length === 0) return null;
        if (data.length === 1 && index === 1) return null;

        const isHighlighted = index === highlightIndex;
        const radius = isHighlighted ? 4 : 2.5; // Smaller dots
        const color = isHighlighted ? COLORS.primaryAccent : COLORS.textPrimary; // Use accent for highlight

        return (
            <Circle
                key={`dot-${index}`}
                cx={x}
                cy={y}
                r={radius}
                fill={color}
            />
        );
    };

    return (
        <View style={styles.container}>
            {!isValidData && !isLoading && (
                <Text variant="caption1" color={COLORS.textSecondary}>No spending data for the last 7 days.</Text>
            )}
            {isValidData && data.length > 0 && (
                <LineChart
                    data={chartDataInternal}
                    width={width}
                    height={height}
                    chartConfig={chartConfig}
                    style={styles.chart}
                    withVerticalLabels={true} // Show X-axis labels (M/D)
                    withHorizontalLabels={false} // Hide Y-axis numerical labels
                    withVerticalLines={true} // Show vertical dashed lines
                    withHorizontalLines={false} // Hide horizontal lines
                    withInnerLines={false}
                    withOuterLines={false} // Hide axis lines
                    withShadow={false}
                    fromZero={true}
                    renderDotContent={renderDot}
                    bezier={false} // Straight lines
                    yLabelsOffset={1000} // Effectively hide Y labels
                    xLabelsOffset={5}
                    paddingRight={20} // Add padding to prevent right label cutoff
                    paddingLeft={5} // Reduce left padding
                    segments={4} // Suggest number of horizontal segments (influences vertical lines)
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120, // Keep minimum height
        marginVertical: 10,
        // paddingHorizontal: 16, // Padding now handled by parent in index.tsx
    },
    chart: {
        // No specific margins needed here now
    },
});
