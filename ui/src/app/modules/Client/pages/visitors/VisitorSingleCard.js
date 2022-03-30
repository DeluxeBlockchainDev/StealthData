import React, { useEffect, useState } from "react";
import { useVisitorsUIContext } from "./VisitorsUIContext";
import {  filterTrackingUrls } from "../../_redux/settings/urlSettingsCrud";
import { withStyles, Typography, Tooltip } from '@material-ui/core';
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/visitors/visitorsActions";
import moment from "moment";
import { round } from "lodash";
import { formatPhoneNumber, getSingleSessionTime, getAccountIndex } from "../../../../utils";


export function VisitorSingleCard({
  leadPriority,
  visitorData,
  handleSeeMore
}) {

  const dispatch = useDispatch();
  const accountIndex = getAccountIndex();
  const { activeSubscription } = useSelector((state) => ({ 
    activeSubscription: (state.multiAuth && state.multiAuth.multiAuthData && state.multiAuth.multiAuthData[accountIndex] && state.multiAuth.multiAuthData[accountIndex].clientData !== null) ? state.multiAuth.multiAuthData[accountIndex].clientData.activeSubscription : {},
  }), shallowEqual);


  const [ trackingUrls, setTrackingUrls ] = useState([]);

  useEffect(() => {
    filterTrackingUrls().then((resp) => {
        const data = resp.data.tabledata;
        setTrackingUrls(data);
    });
  }, []);

  const isTrackedUrl = (pageUrl) => {
    const filtered = trackingUrls.filter(entry => Object.values(entry).some(val => typeof val === "string" && pageUrl.includes(val)));
    console.log(filtered.length);
    return filtered.length > 0;
  }

  const todaysVisited = (pagesVisited) => {
    let currentDate = moment().format('M/D/YYYY')//new Date().toLocaleDateString('en-US', { timeZone: "UTC" });
    let count = 0;
    pagesVisited.map((page) => {
      let pageDate = moment.utc(page.visitedAt).local().format('M/D/YYYY')//new Date(page.visitedAt).toLocaleDateString('en-US', { timeZone: "UTC" })
      if (currentDate === pageDate) {
        count++;
      }
      return page;
    })
    return count;
  }
  const renderPageVisited = (pagesVisited, seeMoreActive) => {
    let totalPage = pagesVisited.length;
    if (totalPage > 5) {
      pagesVisited = pagesVisited.slice(0, 5);
    }
    return pagesVisited
      //.slice(0, !!seeMoreActive ? Infinity : 5)
      .map((page) => <div className="sm_info mb-1 urls" key={Math.random().toString()}>
        <span>
          {moment.utc(page.visitedAt).local().format('M/D/YYYY')} &nbsp;&nbsp;
          {/* {new Date(page.visitedAt).toLocaleDateString('en-US', { timeZone: "UTC" })} */}
          {page.pageUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")}
        </span>
      </div>)
  }


  const getFormattedString = (time) => {
    let seconds = Number(time);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    var mDisplay = '';
    if (s > 0) {
      mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    } else {
      mDisplay = m > 0 ? m + (m === 1 ? " minute" : " minutes") : "";
    }

    var sDisplay = ''
    if (s > 0) {
      sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    }

    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  const renderAllPageVisited = (pagesVisited = []) => {
    let loop_date = '';
    let new_array = [];
    let date_array = [];
    let count = 0;
    let session_sec = 0;
    let total_session_time = 0;
    pagesVisited.map((page, key) => {

      let date = moment.utc(page.visitedAt).local().format('M/D/YYYY');//new Date(page.visitedAt).toLocaleDateString('en-US', { timeZone: "UTC" });
      if (loop_date === '') {

        loop_date = date;
        date_array = [];
        session_sec = 0;
        date_array.push(page)
        if (pagesVisited.length === 1) {
          
          let rand_sec = getSingleSessionTime(page.visitedAt);
          new_array[count] = { 'date': loop_date, 'session_sec': rand_sec, 'visits': date_array };
          total_session_time = rand_sec;
        }
      } else if (loop_date !== date) {
        //new_array[loop_date]= date_array;
        if (date_array.length === 1) {
          session_sec = (session_sec > 0) ? session_sec : getSingleSessionTime(page.visitedAt) ;
        }
        total_session_time = total_session_time + session_sec;

        new_array[count] = { 'date': loop_date, 'session_sec': session_sec, 'visits': date_array };
        count++;
        loop_date = date;
        date_array = [];
        session_sec = 0;
        date_array.push(page)
        if (pagesVisited.length === key + 1) {
          if (date_array.length > 1) {
            let start = date_array[date_array.length - 2].visitedAt;
            let end = date_array[date_array.length - 1].visitedAt;
            let diff = getSessionTimeNew(start, end);

            if (diff < 900) {
              if(diff <= 0){
                let rand_sec = getSingleSessionTime(page.visitedAt);
                session_sec = session_sec + rand_sec;
              }else{
                session_sec = session_sec + diff;
              }
            } else {
              session_sec = session_sec + getSingleSessionTime(page.visitedAt);
            }
          }
          session_sec = (session_sec > 0) ? session_sec : getSingleSessionTime(page.visitedAt);
          total_session_time = total_session_time + session_sec;
          new_array[count] = { 'date': loop_date, 'session_sec': session_sec, 'visits': date_array };
          count++;
          //new_array[loop_date]= date_array;
        }
      } else {

        date_array.push(page)
        if (date_array.length > 1) {
          let start = date_array[date_array.length - 2].visitedAt;
          let end = date_array[date_array.length - 1].visitedAt;
          let diff = getSessionTimeNew(start, end);

          if (diff < 900) {
            if(diff <= 0){
              let rand_sec = getSingleSessionTime(page.visitedAt);
              session_sec = session_sec + rand_sec;
            }else{
              session_sec = session_sec + diff;
            }
          } else {
            session_sec = session_sec + getSingleSessionTime(page.visitedAt);
          }
        }
        if (pagesVisited.length === key + 1) {
          if (date_array.length > 1) {
            let start = date_array[date_array.length - 2].visitedAt;
            let end = date_array[date_array.length - 1].visitedAt;
            let diff = getSessionTimeNew(start, end);

            if (diff < 900) {
              if(diff <= 0){
                let rand_sec = getSingleSessionTime(page.visitedAt);
                session_sec = session_sec + rand_sec;
              }else{
                session_sec = session_sec + diff;
              }
            } else {
              session_sec = session_sec + getSingleSessionTime(page.visitedAt);
            }
          }
          session_sec = (session_sec > 0) ? session_sec : getSingleSessionTime(page.visitedAt);
          total_session_time = total_session_time + session_sec;
          new_array[count] = { 'date': loop_date, 'session_sec': session_sec, 'visits': date_array };
          count++;
        }
      }
      return page;
    });
    return (<div className="page-links-info">
      <div className="visit_total_time">{pagesVisited.length} Visits - Total Session Time {(total_session_time > 0) ? getFormattedString(total_session_time) : '0 minutes'}</div>
      {new_array.map((page, index) => renderPageLink(page, index))}
    </div>)


  }

  const getSessionTimeNew = (start, end) => {
    var startTime = moment(start, 'YYYY-MM-DD HH:mm:ss').format('X');
    let end_time = moment(end, 'YYYY-MM-DD HH:mm:ss').format('X')
    var diffTime = 0;
    if (startTime > end_time) {
      diffTime = startTime - end_time;
    } else {
      diffTime = end_time - startTime;
    }
    var duration = diffTime;
    return duration;
  }


  const secondsToDhms = (seconds) => {
    let totalMinutes = seconds / 60;
    var hours = round(Math.floor(totalMinutes / 60));
    var minutes = Math.floor(seconds % 3600 / 60);
    seconds = round(seconds % 60);

    if (totalMinutes > 60) {
      return hours + '.' + minutes + ' hours';
    } else {
      if (minutes > 1) {
        let min_str = minutes;
        if (seconds > 0) {
          min_str += '.' + seconds
        }
        min_str += ' minutes';
        return min_str;
      } else if (minutes === 1) {
        let min_str = minutes;
        if (seconds > 0) {
          min_str += '.' + seconds
        }
        min_str += ' minute';
        return min_str;
      } else {
        return seconds + ' seconds';
      }
    }
  }

  const renderPageLink = (visit, index) => {
    return (<div key={Math.random().toString()}>
      <div className="visit_info mt-5 urls">
        <div className="visit_time">{moment(visit.date).format('MMM DD, YYYY')} - {visit.visits.length} url views </div>
        <div className="visit_time">Session Time - {secondsToDhms(visit.session_sec)} </div>
      </div>
      {visit.visits.map((page) => <div className="visit_info urls" key={Math.random().toString()}>
        <span className="">
          <div className="row">
            <div className="col-2">
              <span className="text-muted ">
                {moment.utc(page.visitedAt).local().format('M/D/YYYY hh:mm a')}
                {/* {new Date(page.visitedAt).toLocaleDateString('en-US', { timeZone: "UTC" })} {new Date(page.visitedAt).toLocaleTimeString('en-US', { timeZone: "UTC" })}&nbsp;&nbsp; */}
              </span>
            </div>
            <div className="col-10 visit_info_urls">

              <a target="_blank" rel="noreferrer" className="" href={page.pageUrl} style={{backgroundColor:(isTrackedUrl(page.pageUrl)?'#f2fff4':'inherit')}}>

                {page.pageUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")}
              </a>
            </div>
          </div>
        </span>
      </div>)}
    </div>)

  }

  const getPriorityLabel = (priority) => {
    if (priority === 'hot') {
      return (<span className="label_n hot_label ">HOT</span>)
    } else if (priority === 'warm') {
      return (<span className="label_n warm_label ">WARM</span>)
    } else if (priority === 'mild') {
      return (<span className="label_n mild_label ">MILD</span>)
    }
  }

  const getAddress = (row) => {
    let address = '';
    address += (row.address && row.address !== '') ? row.address + '<br/>' : '';
    address += (row.city && row.city !== '') ? ' ' + row.city : '';
    address += (row.state && row.state !== '') ? ' ' + row.state : '';
    address += (row.zipcode && row.zipcode !== '') ? ', ' + row.zipcode : '';
    if (address === '') address = '-';
    // return address;
    let htmlString = address
    return (<span dangerouslySetInnerHTML={{ __html: htmlString }} />);

  }

  const getLeadPriority = (pageVisited) => {
    //mild 1-4, warm 5-9, hot > 9
    let mild_html = '';
    let warm_html = '';
    let hot_html = '';
    if (pageVisited.length > 0) {
      mild_html = `<div class="mild">
      <span>Mild</span>
      <div></div>
      <span>${moment.utc(pageVisited[0].visitedAt).local().format('M/D/YYYY')}</span>
    </div>`;
    }
    if (pageVisited.length > leadPriority.mild) {
      warm_html = `<div class="warm">
      <span>Warm</span>
      <div></div>
      <span>${moment.utc(pageVisited[leadPriority.mild].visitedAt).local().format('M/D/YYYY')}</span>
    </div>`;
      if (moment.utc(pageVisited[leadPriority.mild].visitedAt).local().format('M/D/YYYY') === moment.utc(pageVisited[0].visitedAt).local().format('M/D/YYYY')) mild_html = '';
    }
    if (pageVisited.length > leadPriority.warm) {
      hot_html = `<div class="hot">
      <span>Hot</span>
      <div></div>
      <span>${moment.utc(pageVisited[leadPriority.warm].visitedAt).local().format('M/D/YYYY')}</span>
    </div>`;
      if (moment.utc(pageVisited[leadPriority.warm].visitedAt).local().format('M/D/YYYY') === moment.utc(pageVisited[leadPriority.mild].visitedAt).local().format('M/D/YYYY')) warm_html = '';
    }
    let yourStringWithHtmlInIt = mild_html + warm_html + hot_html;
    //pageVisitedAsc
    return (<div className="priority_status" dangerouslySetInnerHTML={{ __html: yourStringWithHtmlInIt }} />

    )
  }

  const getAge = (corporateData) => {
    if (corporateData && corporateData.birthYear) {
      let year = corporateData.birthYear;
      let date = year + '-01-01';
      let diff = moment().diff(date, 'years');
      return diff + ' years old';
    }
    return '-';
  }

  const HtmlTooltip = withStyles((theme) => ({
    arrow: {
      color: '#007EC3',
    },
    tooltip: {
      backgroundColor: '#007EC3',
      color: '#ffffff',
      maxWidth: 300,
      fontSize: theme.typography.pxToRem(14),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

  const getMatchRating = (likeliHood) => {
    switch (likeliHood) {
      case 6:
        return '75%'
      case 7:
        return '75%'
      case 8:
        return '85%'
      case 9:
        return '95%'
      case 10:
        return '100%'
      default:
        break;
    }
  }
  const getMailIcon = (row) => {
    if(row.unsubscribed && row.unsubscribed === 'true'){
      return (<i className="fas fa-envelope " style={{color: '#f10000'}}/>)
    }else if(row.autoResponderListDate && row.autoResponderListDate !== ''){
      return (<i className="fas fa-envelope " style={{color: '#469ad7'}}/>)
    }else{
      return (<i className="fas fa-envelope " style={{color: '#469ad7'}}/>)
    }
  }
  return (
    <div>
      {

        visitorData.totalCount > 0 &&
        visitorData.entities.map((i, key) => {
          return <div key={i._id} className="tr-main">
            <div className={'tr ' + (activeSubscription && activeSubscription.isLeadPriority ? i.priority : "normal") + '-tr'}>
              {activeSubscription && activeSubscription.isVisits && <div
                className="td"
                style={{
                  maxWidth: "14.6666667%",
                  flexBasis: "14.6666667%",
                }}
              >
                <div className="d-flex align-items-center">
                  <span>
                    <img
                      alt="visits"
                      src="../../media/icon/visits.png"
                      className="td-img"
                    />
                  </span>
                  <span>
                    <p className="mb-1 font-weight-bold">
                      Visits
                                                   </p>
                    <h5 className="mb-0 font-weight-bold tb-sub-heading">
                      {i.visitCount}
                    </h5  >
                  </span>
                </div>
              </div>}
              <div
                className="td"
                style={{
                  maxWidth: "16.6666667%",
                  flexBasis: "16.6666667%",
                }}
              >
                <div className="d-flex align-items-center">
                  <span>
                    <img
                      alt="date"
                      src="../../media/icon/date.png"
                      className="td-img"
                    />
                  </span>
                  <span>
                    <p className="mb-1 font-weight-bold">
                      Date
                                                   </p>
                    <h5 className="mb-0 font-weight-bold tb-sub-heading">
                      {moment.utc(i.lastVisitedAt).local().format('M/D/YYYY')}
                      {/* {new Date(i.lastVisitedAt).toLocaleDateString('en-US', { timeZone: "UTC" })} */}
                    </h5>
                  </span>
                </div>
              </div>
              <div
                className="td"
                style={{
                  maxWidth: (activeSubscription && activeSubscription.isLeadPriority) ? "18.6666667%" : "37%",
                  flexBasis: (activeSubscription && activeSubscription.isLeadPriority) ? "18.6666667%" : "37%",
                }}
              >
                <div className="d-flex align-items-center">
                  <span>
                    <img
                      alt="refral"
                      src="../../media/icon/refral.png"
                      className="td-img"
                    />
                  </span>
                  <span>
                    <p className="mb-1 font-weight-bold">
                      Referal
                                                   </p>
                    <h5 className="mb-0 font-weight-bold tb-sub-heading">
                      Facebook Ad
                                                   </h5>
                  </span>
                </div>
              </div>
              <div
                className="td"
                style={{
                  maxWidth: (activeSubscription && activeSubscription.isUrlsViewed) ? "20.6666667%" : "33%",
                  flexBasis: (activeSubscription && activeSubscription.isUrlsViewed) ? "20.6666667%" : "33%",
                }}
              >
                <div className="d-flex align-items-center">
                  <span>
                    <img
                      alt="company"
                      src="../../media/icon/company.png"
                      className="td-img"
                    />
                  </span>
                  <span>
                    <p className="mb-1 font-weight-bold">
                      Company Info
                                                   </p>
                    <h5 className="mb-0 font-weight-bold tb-sub-heading">
                    Match Rating: {(i.corporateData && i.corporateData.likeliHood) ? getMatchRating(i.corporateData.likeliHood) : '-'}
                    </h5>
                  </span>
                </div>
              </div>
              {activeSubscription && activeSubscription.isUrlsViewed && <div
                className="td"
                style={{
                  maxWidth: "16.6666667%",
                  flexBasis: "16.6666667%",
                }}
              >
                <div className="d-flex align-items-center">
                  <span>
                    <img
                      alt="url"
                      src="../../media/icon/url.png"
                      className="td-img"
                    />
                  </span>
                  <span>
                    <p className="mb-1 font-weight-bold">
                      Urls Viewed
                                                   </p>
                    <h5 className="mb-0 font-weight-bold tb-sub-heading">
                      {todaysVisited(i.pagesVisited)} Today
                                                   </h5>
                  </span>
                </div>
              </div>}
              {activeSubscription && activeSubscription.isLeadPriority && <div
                className="td text-right"
                style={{
                  maxWidth: "12.6666667%",
                  flexBasis: "12.6666667%",
                  paddingTop: "9px",
                  alignSelf: "baseline",
                }}
              >
                {getPriorityLabel(i.priority)}

              </div>}
            </div>

            <div className="tr_info">
              <div className="img">

                <img alt="gender"
                  src={(i.corporateData && i.corporateData.gender == 'male') ? "../../media/users/Male-Avatar.png" : (i.corporateData && i.corporateData.gender == 'female') ? "../../media/users/Felmale-Avatar.png" : "../../media/users/default_img.png"} 
                  style={{width: activeSubscription && (!activeSubscription.isLeadPriority && !activeSubscription.isUrlsViewed) ? "200px" : "120px", height: activeSubscription && (!activeSubscription.isLeadPriority && !activeSubscription.isUrlsViewed) ? "200px" : "120px"}}
                />

              </div>
              <div className="userinfo">
                {/* <h4 className="font-weight-bold mb-3">
                  {i.crmMatchDate && <img
                    src="../../media/icon/goal_icon.png"
                    height="20"
                    style={{ marginRight: 5 }}
                  />}
                  {(i.firstName && i.firstName !== '') ? i.firstName+' '+i.lastName : <small className="text-muted">-</small>}
                </h4> */}
                <div className="d-flex flex-grow-1">
                  <div className="user_info_column">
                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Name of visitor</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="d-flex align-items-center mb-3">
                        <span className="tbl_sm_icon d-flex ">
                          {i.crmMatchDate ? <img
                          alt="goal"
                            src="../../media/icon/goal_icon.png"
                            height="20"
                            style={{ marginRight: 10 }}
                          /> : <div style={{ marginRight: 10, width: 20, height: 20 }}></div>}
                        </span>
                        <span className="user-name">{(i.firstName && i.firstName !== '') ? i.firstName + ' ' + i.lastName : <small className="text-muted">-</small>}</span>
                      </div>
                    </HtmlTooltip>

                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Personal email</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          {getMailIcon(i)}
                          
                          {/* <img alt="email" src="../../media/icon/envolepe.png" /> */}
                        </span>
                        <span>{i.email || '-'}</span>
                      </div>
                    </HtmlTooltip>

                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Main phone line</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          <img alt="phone" src="../../media/icon/phone.png" />
                        </span>
                        <span>{!!i.phoneNo ? formatPhoneNumber(i.phoneNo) : '-'}</span>
                      </div>
                    </HtmlTooltip>

                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Cell phone</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          <img alt="mobile" src="../../media/icon/mobile.png" />
                        </span>
                        <span>{!!i.phoneNo ? formatPhoneNumber(i.phoneNo) : '-'}</span>
                      </div>
                    </HtmlTooltip>

                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Address on file for visitor</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          <img alt="location" src="../../media/icon/location.png" />
                        </span>
                        <span className="word-break">
                          {getAddress(i)}
                        </span>
                      </div>
                    </HtmlTooltip>
                    <div className="social_icons">


                      {(i.corporateData && i.corporateData.linkedInURL) ?
                        <HtmlTooltip
                          arrow
                          placement="top"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Visitors Linkedin profile</Typography>
                            </React.Fragment>
                          }
                        >
                          <a target="_blank" rel="noopener noreferrer" href={'http://' + i.corporateData.linkedInURL}>
                            <img
                            alt="linkedin"
                              src="../../media/icon/linkedin.png"
                              height="18"
                            />
                          </a></HtmlTooltip> : null}

                      {(i.corporateData && i.corporateData.facebookURL) ?
                        <HtmlTooltip
                          arrow
                          placement="top"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Visitors Facebook profile</Typography>
                            </React.Fragment>
                          }
                        >
                          <a target="_blank" rel="noopener noreferrer" href={'http://' + i.corporateData.facebookURL}>
                            <img
                            alt="facebook"
                              src="../../media/icon/facebook.png"
                              height="18"
                            />
                          </a></HtmlTooltip> : null}

                      {(i.corporateData && i.corporateData.twitterURL) ?
                        <HtmlTooltip
                          arrow
                          placement="top"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Visitors Twitter profile</Typography>
                            </React.Fragment>
                          }
                        >
                          <a target="_blank" rel="noopener noreferrer" href={'http://' + i.corporateData.twitterURL}>
                            <img
                            alt="twitter"
                              src="../../media/icon/twitter.png"
                              height="18"
                            />
                          </a></HtmlTooltip> : null}

                    </div>
                  </div>

                  <div className="user_info_column">
                    <div className="d-flex align-items-center mb-3" style={{ height: '20px', width: '20px' }} />

                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Proximity to your business</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          <img alt="navigation" src="../../media/icon/navigation.png" />
                        </span>
                        <span>
                          18 Miles from Sneed Ford
                                                     </span>
                      </div>
                    </HtmlTooltip>

                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Age</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          <img alt="birthday" src="../../media/icon/birthday.png" />
                        </span>
                        <span>{getAge(i.corporateData)}</span>
                      </div>
                    </HtmlTooltip>

                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Dwelling status (rent or own)</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          <img alt="home" src="../../media/icon/home_icon.png" />
                        </span>
                        <span>RENT</span>
                      </div>
                    </HtmlTooltip>
                    {/* <Tooltip title="Visitors estimated annual income" placement="top"> */}
                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Estimated annual income</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info cursor-pointer">
                        <span className="tbl_sm_icon">
                          <img alt="money" src="../../media/icon/money.png" />
                        </span>
                        <span>$100000 - $149999</span>
                      </div>
                    </HtmlTooltip>

                    {/* </Tooltip> */}

                  </div>

                  <div className="user_info_column">
                    <div className="d-flex align-items-center mb-3" style={{ height: '20px', width: '20px' }} />
                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Company visitor works for</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          <img alt="building" src="../../media/icon/building.png" />
                        </span>
                        <span className="word-break">
                          <a className="text-capitalize" target="_blank" rel="noopener noreferrer" href={(i.corporateData && i.corporateData.jobCompanyWebsite) ? 'http://' + i.corporateData.jobCompanyWebsite : '#'}>{(i.corporateData && i.corporateData.jobCompanyName) ? i.corporateData.jobCompanyName : '-'}</a>
                        </span>
                      </div>
                    </HtmlTooltip>

                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Visitors work email</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          <img alt="email" src="../../media/icon/envolepe.png" />
                        </span>
                        <span>
                          {(i.corporateData && i.corporateData.workMail) ? i.corporateData.workMail : '-'}</span>
                      </div>
                    </HtmlTooltip>

                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Visitors job title</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          <img alt="job" src="../../media/icon/job.png" />
                        </span>
                        <span className="word-break text-capitalize">{(i.corporateData && i.corporateData.jobTitle) ? i.corporateData.jobTitle : '-'}</span>
                      </div>
                    </HtmlTooltip>

                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Company size</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          <img alt="group" src="../../media/icon/group.png" />
                        </span>
                        <span className="word-break text-capitalize">
                          {(i.corporateData && i.corporateData.jobCompanySize) ? i.corporateData.jobCompanySize + ' employees' : '-'}
                        </span>
                      </div>
                    </HtmlTooltip>

                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Company industry</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          <img alt="factory" src="../../media/icon/factory.png" />
                        </span>
                        <span className="word-break text-capitalize">{(i.corporateData && i.corporateData.jobCompanyIndustry) ? i.corporateData.jobCompanyIndustry : '-'}</span>
                      </div>
                    </HtmlTooltip>

                    <HtmlTooltip
                      arrow
                      placement="top"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Company location</Typography>
                        </React.Fragment>
                      }
                    >
                      <div className="sm_info">
                        <span className="tbl_sm_icon">
                          <img alt="map" src="../../media/icon/map.png" />
                        </span>
                        <span className="word-break text-capitalize">
                          {(i.corporateData && i.corporateData.jobCompanyLocationMetro) ? i.corporateData.jobCompanyLocationMetro : '-'}
                        </span>
                      </div>
                    </HtmlTooltip>

                    <div className="social_icons">
                      {(i.corporateData && i.corporateData.jobCompanyLinkedInURL) ?
                        <HtmlTooltip
                          arrow
                          placement="top"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Company Linkedin</Typography>
                            </React.Fragment>
                          }
                        >
                          <a target="_blank" rel="noopener noreferrer" href={'http://' + i.corporateData.jobCompanyLinkedInURL}>
                            <img
                            alt="linkedin"
                              src="../../media/icon/linkedin.png"
                              height="18"
                            />
                          </a></HtmlTooltip>
                        : null}

                      {(i.corporateData && i.corporateData.jobCompanyFacebookURL) ?
                        <HtmlTooltip
                          arrow
                          placement="top"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Company Facebook</Typography>
                            </React.Fragment>
                          }
                        >
                          <a target="_blank" rel="noopener noreferrer" href={'http://' + i.corporateData.jobCompanyFacebookURL}>
                            <img
                            alt="facebook"
                              src="../../media/icon/facebook.png"
                              height="18"
                            />
                          </a></HtmlTooltip> : null}

                    </div>
                  </div>
                </div>
              </div>

              {activeSubscription && (activeSubscription.isLeadPriority || activeSubscription.isUrlsViewed) && <div className="otherinfo">
                {activeSubscription && activeSubscription.isLeadPriority && <div className="priority">
                  <label>Lead Priority &nbsp;</label>
                  {getLeadPriority(i.pageVisitedAsc)}
                  {/* <div className="priority_status">
                    <div className="mild">
                      <span>Mild</span>
                      <div></div>
                      <span>4/16/21</span>
                    </div>
                    <div className="warm">
                      <span>Warm</span>
                      <div></div>
                      <span>4/16/21</span>
                    </div>
                    <div className="hot">
                      <span>Hot</span>
                      <div></div>
                      <span>4/16/21</span>
                    </div>
                  </div> */}
                </div>}
                {activeSubscription && activeSubscription.isUrlsViewed && <>
                {renderPageVisited(i.pagesVisited, i.seeMoreActive)}
                {
                  i.visitCount > 0 && !i.seeMoreActive && <a href="#!" onClick={() => handleSeeMore({ loginAPIAccessKey: i.loginAPIAccessKey, email: i.email, offset: 0, limit: 50, })}>{i.visitCount !== i.pagesVisited ? 'See More' : 'See More'}</a>
                }</>}

              </div>}
            </div>

            {(i.seeMoreActive) && (
              <div className="border-top">

                {renderAllPageVisited(i.pagesVisited)}

                {(!i.hasNoMoreUrls) && <div className="sm_info mb-1 urls centerText mt-3">
                  <a href="#!" className="see_more" onClick={() => handleSeeMore({ loginAPIAccessKey: i.loginAPIAccessKey, email: i.email, offset: (i.next_offset || 0), limit: 50, })}>{i.visitCount !== i.pagesVisited ? 'See More' : 'See More'}</a>

                  {/* <a
                    onClick={() =>
                      dispatch(actions.visitorVisitsSeeLess({ email: i.email }))
                    }
                  >See Less</a> */}
                </div>}
                {i.hasNoMoreUrls &&
                  <div className="sm_info mb-1 urls mt-3">
                    <div className="closeBox">
                      <a href="#!" onClick={() => dispatch(actions.visitorVisitsSeeLess({ email: i.email }))}>CLOSE &nbsp;x</a>
                    </div>
                  </div>}
              </div>
            )}
          </div>;
        })
      }
    </div>
  );
}


