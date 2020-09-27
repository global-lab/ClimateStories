import React from "react";
import './styles.css'


const colnames = [
    {
        title: 'Title', field: 'Title'
    },
    {
        title: 'Location', field: 'ProjectCenter'
    },
    {
        title: 'Sponsor', field: 'Sponsor'
    },
    {
        title: 'Date', field: 'Date'
    },
    {
        title: 'Link', field: 'Link',
        render: rowData => <a href={rowData.Link} target="_blank">{rowData.Link}</a>,
    }
]

export default colnames;