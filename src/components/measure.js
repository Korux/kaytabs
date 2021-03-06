import React, { createRef, Fragment, useEffect } from 'react'
import styled from 'styled-components';

const MBlock = styled.div`
    position : relative;
    width:60px;
    height : 60px;
    background-color: ${({i}) => i % 3 === 0 ? 'rgb(10,85,160)' : 'rgb(160,160,160)'} ;
    border-left:2px solid black ;
    border-right: ${({i}) => i === 17  ? '2px solid black' : '0'} ;
    border-bottom:${({j}) => j === 4 ? '4px solid black' : '0'};
    flex:1;
    pointer-events:${props => props.type === "edit" ? 'auto' : 'none'};

    &:hover{
        background-color: ${({i}) => i % 3 === 0 ? 'rgb(40,145,210)' : 'rgb(220,220,220)'} ;
        cursor : pointer;
    }
`;

const MHighlight = styled.div`
    background-color: ${({active}) => active ? 'rgba(248, 247, 216, 0.5)' : 'rgba(0,0,0,0)' } ;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const MLine = styled.div`
    display : flex;
    margin: auto;
    width:fit-content;
`;

const MCount = styled.div`
    width:180px;
    height:60px;
    background-color:${({theme}) => theme.primaryDark};
    border:0px;
    color:white;
    font-size:20px;
    pointer-events:none;
    text-align:left !important;
    padding-left:20px;
`;

const MNoteEnd = styled.div`
    width:180px;
    height:60px;
    background-color:${({theme}) => theme.primaryDark};
    border:0px;
    color:black;
    font-size:30px;
    pointer-events:none;
    text-align:top !important;

`;

const MNoteLine = styled.hr`
    position:relative;
    border:none;
    height:2px;
    background-color:black;
    margin-top:13px;
    margin-bottom:0;
    margin-left:0;
`;

const MNoteLineHalf = styled(MNoteLine)`
    position:relative;
    width:50%;
`;

const MNoteLineNone = styled(MNoteLine)`
    background-color:rgba(0,0,0,0);
`;

const MNoteEndEighth = styled.div`
    text-align : left !important;
    font-size:100px;
    transform:rotate(-90deg);
    position:relative;
    margin-left:-125px;
    margin-top:-228px;

`;

const MNoteEndSixteenth = styled.div`
    text-align : left !important;
    font-size:100px;
    transform:rotate(-90deg);
    position:relative;
    margin-left:-125px;
    margin-top:-228px;
`;

const MNote = styled.span`
    position:relative;
    height: 35px;
    width: 35px;
    background-color: #000;
    border-radius: 50%;
    display: inline-block;
    margin-top:-2px;
`;

const MNoteWhite = styled.span`
    position:relative;
    height: 35px;
    width: 35px;
    background-color: #fff;
    border: 2px solid black;
    border-radius: 50%;
    display: inline-block;
    margin-top:-2px;
`;

function Measure(props){

    const [measureRefs, setMeasureRefs] = React.useState([]);

    useEffect(() => {
        // add or remove refs
        setMeasureRefs((measureRefs) =>
        Array(4)
        .fill()
        .map((_, i) => measureRefs[i] || createRef()),
        );
      }, []);

      useEffect(() => {
        if(props.active[0] === props.count){
            let currLine = 4 - props.active[1][0];
          measureRefs[currLine].current.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
        }
      },[props.active]);

    function addNote(i,j,type){
        let newData = props.data.notes.slice();
        if(newData[props.count-1][j][i] !== 0) return;
        if(!newData[props.count-1][j].includes(type) && newData[props.count-1][j].reduce((a, b) => a + b, 0) !== 0) return;
        if (type === 2){
            if(j === 0) return;
            if(newData[props.count-1][j-1].reduce((a, b) => a + b, 0) > 0) return;
            newData[props.count-1][j][i] = type;
            newData[props.count-1][j-1][i] = -99;
        }
        else if (type === 4){
            if(j !== 3) return;
            if(newData[props.count-1][j-1].reduce((a, b) => a + b, 0) > 0
            || newData[props.count-1][j-2].reduce((a, b) => a + b, 0) > 0
            || newData[props.count-1][j-3].reduce((a, b) => a + b, 0) > 0) return;
            newData[props.count-1][j][i] = type;
            newData[props.count-1][j-1][i] = -99;
            newData[props.count-1][j-2][i] = -99;
            newData[props.count-1][j-3][i] = -99;
        }else{
            newData[props.count-1][j][i] = type;
        }
        let mCount = props.data.measures;
        props.setData({measures:mCount, notes:newData});
    }

    function removeNote(i,j){
        let newData = props.data.notes.slice();
        if(newData[props.count-1][j][i] === 2){
            newData[props.count-1][j][i] = 0;
            newData[props.count-1][j-1][i] = 0;
        }else if(newData[props.count-1][j][i] === 4){
            newData[props.count-1][j][i] = 0;
            newData[props.count-1][j-1][i] = 0;
            newData[props.count-1][j-2][i] = 0;
            newData[props.count-1][j-3][i] = 0;
        }else{
            newData[props.count-1][j][i] = 0;
        }
        let mCount = props.data.measures;
        props.setData({measures:mCount, notes:newData});
    }

    function genNote(i,j){

        var rightMost = 0;
        var isRightMost = true;
        var notes = props.data.notes;
        var noteType = notes[props.count-1][j][i];
        var stanzaNoteType = 0;

        notes[props.count-1][j].forEach((note,c) => {
            if(note !== 0 && c > rightMost){
                stanzaNoteType = note;
                rightMost = c;
            }
        });

        isRightMost = i >= rightMost;

        if(isRightMost && noteType){
            if(noteType === 1) return (<Fragment><MNoteLineHalf/><MNote/></Fragment>);
            if(noteType === 2) return (<Fragment><MNoteLineHalf/><MNoteWhite/></Fragment>);
            if(noteType === 4) return (<Fragment><MNoteLineNone/><MNoteWhite/></Fragment>);
            if(noteType === 8) return (<Fragment><MNoteLineHalf/><MNote/></Fragment>);
            if(noteType === 16) return (<Fragment><MNoteLineHalf/><MNote/></Fragment>);
            if(noteType === -99) return(<Fragment></Fragment>);
        }
        if(!isRightMost && noteType){
            if(noteType === 1) return (<Fragment><MNoteLine/><MNote/></Fragment>);
            if(noteType === 2) return (<Fragment><MNoteLine/><MNoteWhite/></Fragment>);
            if(noteType === 4) return (<Fragment><MNoteLineNone/><MNoteWhite/></Fragment>);
            if(noteType === 8) return (<Fragment><MNoteLine/><MNote/></Fragment>);
            if(noteType === 16) return (<Fragment><MNoteLine/><MNote/></Fragment>);
            if(noteType === -99) return(<Fragment></Fragment>);
        }
        if(i < rightMost && !noteType){
            if(stanzaNoteType === 4 || stanzaNoteType === -99) return(<Fragment></Fragment>);
            return (<Fragment><MNoteLine/></Fragment>);
        }
        return(<Fragment></Fragment>);
    }

    function genNoteEnd(j){
        if(props.data.notes[props.count-1][j].includes(1)){
            return (<Fragment><MNoteLine/></Fragment>);
        }
        if(props.data.notes[props.count-1][j].includes(2)){
            return (<Fragment><MNoteLine/></Fragment>);
        }
        if(props.data.notes[props.count-1][j].includes(8)){
            return (<Fragment>
                <MNoteLine/>
                <MNoteEndEighth>
                &#119150;
                </MNoteEndEighth>
            </Fragment>);
        }
        if(props.data.notes[props.count-1][j].includes(16)){
            return (<Fragment>
                <MNoteLine/>
                <MNoteEndSixteenth>
                &#119151;
                </MNoteEndSixteenth>
            </Fragment>);
        }
        return(<Fragment></Fragment>); 
    }

    
    return(
        <Fragment>
            {
            [...Array(4),].map((val,j) => (
                <MLine ref={measureRefs[j]} key={j}>
                    <MNoteEnd>{genNoteEnd(j)}</MNoteEnd>
                    {[...Array(17),].map((val,i) => (
                        <MBlock i={i+1} j={j+1} key={i * (j+1)} type={props.type} onClick={ props.mode === "plus" ?  () => addNote(i,j, props.notetype) : () => removeNote(i,j)}>
                            <MHighlight active={props.active[0] === props.count && props.active[1].includes(4-j)}/>
                            {genNote(i,j)}
                            
                        </MBlock>
                    ))}
                    <MCount j={j+1}><br/>{j+1 === 4 && props.count}</MCount>
                </MLine>    
            ))            
            }
        </Fragment>
    );

}

export default Measure;