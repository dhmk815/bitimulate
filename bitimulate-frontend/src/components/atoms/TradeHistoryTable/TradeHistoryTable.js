import React, { Component } from 'react';
import styles from './TradeHistoryTable.scss';
import classNames from 'classnames/bind';
import {limitDigit} from 'lib/utils';
import moment from 'moment';
import scuize from 'lib/hoc/scuize';
import ReactTooltip from 'react-tooltip';

const cx = classNames.bind(styles);

const statusMap = {
  'processed': '완료',
  'waiting': '대기',
  'cancelled': '취소'
}

const Row = ({date, type, rate, amount, personal, status}) => {
  const d = new Date(date);
  const calculatedGMT = new Date(d.valueOf() - d.getTimezoneOffset() * 60000)
  return (
    <div className={cx('row', 'flicker', { personal })}>
      <div className={cx('col', 'time')}>
        {moment(personal ? date : calculatedGMT).format('HH:mm')}
      </div>
      <div className={cx('col', 'type')}>
        {type === 'sell' ? '매도' : '매수'}
      </div>
      <div className={cx('col')}>
        {limitDigit(rate)}
      </div>
      <div className={cx('col')}>
        {limitDigit(amount)}
      </div>
      { personal && <div className={cx('col', 'status', {
        processed: status === 'processed'
      })}>
          {statusMap[status]}
        </div>}
    </div>
  )
}

const OptimizedRow = scuize(function (nextProps, nextState) {
  return this.props.status !== nextProps.status;
})(Row);




// // date | type | price | amount
const TradeHistoryTable = ({data, personal}) => {

  const tooltip = personal ? {
    'data-tip': "항목을 더블클릭하여 거래 취소",
    'data-effect': 'solid'
  } : {} 

  const rows = data && data.map(
    row => {
      if(!personal) {
        return <OptimizedRow id={row.get('tradeID')} key={row.get('tradeID')} {...row.toJS()}/>;
      } else {
        const { 
          _id, price, amount, status, sell
        } = row.toJS();
        return <OptimizedRow personal key={_id} rate={price} amount={amount} type={sell ? 'sell' : 'buy'} status={status}/>
      }
    }
  )
  return (
    <div className={cx('trade-history-table')}>
      <div className={cx('title')}>
        거래내역
      </div>
      <div className={cx('head')}>
        <div className={cx('col', 'time')}>
          시간
        </div>
        <div className={cx('col', 'type')}>
          종류
        </div>
        <div className={cx('col')}>
          가격
        </div>
        <div className={cx('col')}>
          거래량
        </div>
        { personal && <div className={cx('col', 'status')}>
          상태
        </div>}
      </div>
      <div className={cx('rows')} {...tooltip}>
        {rows}
      </div>
      <ReactTooltip />
    </div>
  );
};

export default TradeHistoryTable;