/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { makeStyles, Button } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
    Card,
    CardBody,
    CardHeader,
} from "../../../../../_metronic/_partials/controls";
import moment from "moment";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../Admin/_redux/clients/clientsActions";
import { defaultLeadPriority, getAccountIndex } from "../../../../utils";

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    formControl: {
        margin: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(1, 1, 0, 0),
    },
    optionRow: {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '75%'
    }
}));
export function LeadPrioritySettings() {
    //const { history, match : { params } } = props.props;
    console.log('accountIndex.....',accountIndex)
    const accountIndex = getAccountIndex();
    const maxPriority = 20;
    const [leadPriorityArray, setLearPriorityArray] = React.useState(defaultLeadPriority());
    const [initalLeadPrority, setInitalLeadPrority] = React.useState(defaultLeadPriority());
    const [showAddPriority, setShowAddPriority] = React.useState(false)
    const [showConfirmBox, setShowConfirmBox] = React.useState(false)
    const [showSuccess, setShowSuccess] = React.useState(false)

    const dispatch = useDispatch();
    const { actionsLoading, leadPriorities, user, clientData } = useSelector(
        (state) => ({
            actionsLoading: state.clients.actionsLoading,
            leadPriorities: state.clients.leadPriorities,
            user: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].user !== null) ? state.multiAuth.multiAuthData[accountIndex].user : {},
            clientData: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData : {},
        }),
        shallowEqual
    );

    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render

    useEffect(() => {
        let params = { client_id: user.id, page: 1, limit: 100, sortOrder:-1, sortField: 'createdAt' };
        dispatch(actions.fetchLeadPriority(params));
    }, [user, dispatch]);

    useEffect(() => {
        let defaultRow = initalLeadPrority
        defaultRow['createdAt'] = clientData.createdAt;
        setInitalLeadPrority(defaultRow)
    }, [clientData,initalLeadPrority]);


    const handleTextChange = (event, type) => {
        let lp = { ...leadPriorityArray };
        if (event.target.value !== '') {
            let val = parseInt(event.target.value);
            lp[type] = val

            if (type === 'mild') {
                if (lp.mild + 1 >= lp.warm) {
                    lp.warm = lp.mild + 2;
                }
                if (lp.warm >= lp.hot) {
                    lp.hot = lp.warm + 1;
                }
            } else if (type === 'warm') {
                if (val >= 3) {
                    //if(lp.warm >= lp.hot){
                    lp.hot = lp.warm + 1;
                    //}
                    if (lp.warm <= lp.mild + 1) {
                        lp.mild = lp.warm - 2;
                    }
                }

            } else if (type === 'hot') {
                if (val >= 4) {
                    if (lp.hot <= lp.warm) {
                        lp.warm = lp.hot - 1;
                    }
                    if (lp.hot > lp.warm + 1) {
                        lp.warm = lp.hot - 1;
                    }
                    if (lp.warm <= lp.mild + 1) {
                        lp.mild = lp.warm - 2;
                    }
                    
                }
            }

        } else {
            lp[type] = event.target.value;
        }
        if (lp.mild > maxPriority || lp.warm > maxPriority || lp.hot > maxPriority) {

        } else {
            setLearPriorityArray(lp)
        }


    };

    const saveLeadPriority = async () => {

        let res = await dispatch(actions.postLeadPriority(user.id, leadPriorityArray));
        if(res){
            setShowSuccess(true)
            setShowConfirmBox(false); 
            setShowAddPriority(false);
            let check = await dispatch(actions.updateRecorrectVisitCount(user.id));
            if(check){
                setShowSuccess(false)
            }
        }
        
    };


    const tableRow = () => {
        return (
            <div className="tr tr-border-bottom">
                <div className="td text-blue" style={{ maxWidth: '15%', flexBasis: '15%' }}>
                    {''}
                </div>
                <div className="td text-center text-light-gray justify-content-center d-flex" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                    <div className={classes.optionRow}>
                        <div>
                            <select
                                disabled={true}
                                value={1}
                                className="form-control"
                                name="mildFrom"
                                placeholder="From"
                            >
                                <option value="1">1</option>
                            </select>

                        </div>
                        <div className="text-center d-flex justify-content-center align-item-center">
                            to
                        </div>
                        <div>
                            <select
                                value={leadPriorityArray.mild}
                                className="form-control"
                                name="mildTo"
                                placeholder="To"
                                onChange={(e) => handleTextChange(e, 'mild')}
                            >
                                {[...Array(maxPriority).keys()].map((key) => <option key={key} value={key + 1}>{key + 1}</option>)}
                            </select>
                        </div>

                    </div>
                </div>
                <div className="td text-center text-light-gray justify-content-center d-flex" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                    <div className={classes.optionRow}>
                        <div>
                            <select
                                disabled={true}
                                value={leadPriorityArray.mild + 1}
                                className="form-control"
                                name="warmFrom"
                                placeholder="From"

                            >
                                {[...Array(maxPriority).keys()].map((key) => <option key={key} value={key + 1}>{key + 1}</option>)}

                            </select>

                        </div>
                        <div className="text-center d-flex justify-content-center align-item-center">
                            to
                        </div>
                        <div>
                            <select
                                value={leadPriorityArray.warm}
                                className="form-control"
                                name="warmTo"
                                placeholder="To"
                                onChange={(e) => handleTextChange(e, 'warm')}
                            >
                                {[...Array(maxPriority).keys()].map((key) => 
                                <option 
                                disabled={(key >= 2) ? false : true}
                                key={key} value={key + 1}>{key + 1}</option>
                                )}
                            </select>
                        </div>

                    </div>
                </div>

                <div className="td text-center text-light-gray justify-content-center d-flex" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                    <div className={classes.optionRow}>
                        <div>
                            <select
                                value={leadPriorityArray.hot}
                                className="form-control"
                                name="hotFrom"
                                placeholder="From"
                                onChange={(e) => handleTextChange(e, 'hot')}
                            >
                                {[...Array(maxPriority).keys()].map((key) => <option 
                                disabled={(key >= 3) ? false : true}
                                key={key} value={key + 1}>{key + 1}</option>)}

                            </select>

                        </div>
                        <div className="text-center d-flex justify-content-center align-item-center">
                            to
                        </div>
                        <div>
                            <select
                                value={'∞'}
                                disabled={true}
                                className="form-control"
                                name="hotTo"
                                placeholder="To"
                            >
                                <option value="∞">∞</option>
                            </select>
                        </div>

                    </div>
                </div>

                <div className="td text-center" style={{ maxWidth: '25%', flexBasis: '25%' }}>
                    <button
                        className="btn btn-primary font-weight-bolder font-size-sm ml-3"
                        style={{ minWidth: '70px' }}
                        onClick={() => {
                            setShowConfirmBox(true);
                        }}
                    >Save</button>

                    <button
                        className="btn btn-warning font-weight-bolder font-size-sm ml-3"
                        style={{ minWidth: '70px' }}
                        onClick={() => {
                            setShowAddPriority(false);
                        }}
                    >Close</button>
                </div>
            </div>
        );
    }

    const initialRow = (priority) => {
        return (<div key={Math.random().toString()} className="tr tr-border-bottom">
            <div className="td text-blue" style={{ maxWidth: '15%', flexBasis: '15%' }}>
                {moment.utc(priority.createdAt).local().format('M/D/YYYY')}
            </div>
            <div className="td text-center text-light-gray" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                1-{priority.mild} url views
        </div>
            <div className="td text-center text-light-gray" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                {priority.mild + 1}-{priority.warm} url views
        </div>
            <div className="td text-center text-light-gray" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                {priority.hot}+ url views
        </div>
            <div className="td text-center" style={{ maxWidth: '25%', flexBasis: '25%' }}>
                {(!leadPriorities || leadPriorities.length === 0) && <button
                    className="btn btn-primary font-weight-bolder font-size-sm ml-3"
                    style={{ minWidth: '70px' }}
                    onClick={() => {
                        setShowAddPriority(true);
                    }}
                >Edit</button>}
            </div>
        </div>)
    }

    const readOnlyRow = (priority, key) => {
        return (<div key={Math.random().toString()} className="tr tr-border-bottom">
            <div className="td text-blue" style={{ maxWidth: '15%', flexBasis: '15%' }}>
                {moment.utc(priority.createdAt).local().format('M/D/YYYY')}
            </div>
            <div className="td text-center text-light-gray" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                1-{priority.mild} url views
        </div>
            <div className="td text-center text-light-gray" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                {priority.mild + 1}-{priority.warm} url views
        </div>
            <div className="td text-center text-light-gray" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                {priority.hot}+ url views
        </div>
            <div className="td text-center" style={{ maxWidth: '25%', flexBasis: '25%' }}>
                {(key === 0) && <button
                    className="btn btn-primary font-weight-bolder font-size-sm ml-3"
                    style={{ minWidth: '70px' }}
                    onClick={() => {
                        setShowAddPriority(true)
                    }}
                >Edit</button>}
            </div>
        </div>)
    }
    
    return (<div>
        {showSuccess && <div className="row justify-content-center d-flex mb-5">
            <div className="col-lg-6 col-sm-12 col-md-12">
                <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    Lead priority rules updated successfully
                </Alert>
            </div>
        </div>}
        
        {showConfirmBox && 
            <div className="row justify-content-center d-flex">
                <div className="col-lg-6 col-sm-12 col-md-12">
                    <Card>
                        <CardBody>
                            <Alert variant="filled" severity="warning" color="error" style={{backgroundColor:'#F54E5F'}}>
                                <div className="row">
                                    <div className="col-12">
                                        WARNING - Changing your lead priority can have dramatic affects on how your identified visitors are prioritized. Are you sure you want to make this change?
                                    </div>
                                </div>
                                <div className="row mt-2 justify-content-center d-flex">
                                    <div className="col-12 d-flex justify-content-end">
                                        <Button variant="contained" color="secondary" style={{ marginRight: 10 }}
                                        onClick={() => {saveLeadPriority();}}
                                        >
                                            Save
                                    </Button>
                                        <Button variant="contained" 
                                        onClick={() => {setShowConfirmBox(false); setShowAddPriority(false);}}
                                        >
                                            Close
                                    </Button>
                                    </div>
                                </div>
                            </Alert>
                        </CardBody>
                    </Card>
                </div>
            </div>
        }
        <Card>
        <CardHeader title="Lead Priority Settings">
        </CardHeader>
        <CardBody>
            {(actionsLoading) && <div className="ctm-spanner">
                <div className="ctm-loader"></div>
            </div>}
            <div className="custom-tbl-wrapper">
                <div className="custom-div-tbl">
                    <div className="thead tr-border-bottom">
                        <div className="th" style={{ maxWidth: '15%', flexBasis: '15%' }}>
                            DATE
                        </div>
                        <div className="th text-center" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                            MILD
                            <div className="priority_status text-center justify-content-center">
                                <div className="mild"><div /></div>
                            </div>
                        </div>
                        <div className="th text-center" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                            WARM
                            <div className="priority_status text-center justify-content-center">
                                <div className="warm"><div /></div>
                            </div>
                        </div>
                        <div className="th text-center" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                            HOT
                            <div className="priority_status text-center justify-content-center">
                                <div className="hot"><div /></div>
                            </div>
                        </div>
                        <div className="th" style={{ maxWidth: '25%', flexBasis: '25%' }}></div>
                    </div>
                    <div className="tbody">
                        {showAddPriority && tableRow()}

                        {leadPriorities && leadPriorities.map((priority, key) => readOnlyRow(priority, key))}

                        {initalLeadPrority && initialRow(initalLeadPrority, 1)}

                    </div>

                </div>
            </div>

        </CardBody>
    </Card>
        

    </div>)

}
