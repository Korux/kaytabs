import React from 'react';
import Tab from '../components/tab';

import styled from 'styled-components';

const TabContainer = styled.div`
    display: flex;
    width:80%;
    margin:auto;
`;

const TabColumn = styled.div`
    flex:1;
`;

function TabList(props){

    function genTabs(){

        let tabInfo = props.data;

        if(tabInfo === null){
            return(<></>);
        }
        if(tabInfo.Error){
            const Error = styled.div`
                margin-top:150px;
            `;
            return(<Error>
                <h1>Error</h1>
                <span>Could not fetch tablatures. Please try again later. (｡•́︿•̀｡)</span>
            </Error>);
        }
        if(tabInfo.length === 0){
            const Error = styled.div`
                margin-top:150px;
            `;
            return(<Error>
                <h1>Error</h1>
                <span>No Tablatures to display. (｡•́︿•̀｡)</span>
            </Error>);
        }

        let col1 = []; // 0 3 6 9 ..
        let col2 = []; // 1 4 7 ...
        let col3 = []; // 2 5 8 ...

        tabInfo.forEach((element,i) => {
            if(i % 3 === 0) col1.push(element);
            if((i - 1) % 3 === 0) col2.push(element);
            if((i - 2) % 3 === 0) col3.push(element);
        });

        return(
            <TabContainer>
                <TabColumn>
                    {col1.map((tab,i) => {
                        return(<Tab key={"col1" + i} data={tab}/>)
                    })}
                </TabColumn>

                <TabColumn>
                    {col2.map((tab,i) => {
                        return(<Tab key={"col2" + i} data={tab}/>)
                    })}
                </TabColumn>

                <TabColumn>
                    {col3.map((tab,i) => {
                        return(<Tab key={"col3" + i} data={tab}/>)
                    })}
                </TabColumn>

            </TabContainer>
        );
    }

    return(
        <>
            {genTabs()}
        </>
    );

}

export default TabList;