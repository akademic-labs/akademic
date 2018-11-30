export interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor?: string[];
        borderColor?: string[];
        borderWidth?: number;
        hoverBorderWidth?: number;
        hoverBackgroundColor?: string[];
        label?: string;
    }[];

    options: {
        cutoutPercentage?: number,
        title?: {
            display: boolean;
            text: string;
            fontSize: number;
            fontColor?: string;
        };
        legend?: {
            position: string;
            labels?: {
                fontColor: string;
            },
            display?: boolean;
        };
        scales?: {
            pointLabels?: {
                fontSize: number
            },
            xAxes?: [{
                ticks: {
                    beginAtZero: boolean;
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: boolean
                }
            }]
        };
        maintainAspectRatio?: boolean;
    }
}
