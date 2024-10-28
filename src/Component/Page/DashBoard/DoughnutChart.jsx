import { Doughnut } from "react-chartjs-2"
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

function DoughnutChart(){
    const data = {
        labels: ['RC','DL'],
        datasets:[
            {
                label:'Card',
                data:[3,2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            }
        ]
    }
    return(
        <Doughnut data={data} />
    )
}
export default DoughnutChart