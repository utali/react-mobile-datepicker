/**
 * @module DateTimePicker Component
 */

import React, { Component, Fragment } from "react";
import DatePickerItem from "../DatePickerItem.js";
import PureRender from "../pureRender.js";
import { convertDate, nextDate } from "../time.js";
import { dateConfigMap } from "../dataSource";
import "./index.css";

/**
 * 大写首字母
 * @param {String} 字符串
 */
const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join("");

/**
 * 判断数组
 * @param {any} val
 */
const isArray = (val) =>
  Object.prototype.toString.apply(val) === "[object Array]";

/**
 * Class DateTimePicker Component Class
 * @extends Component
 */
class DateTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: nextDate(this.props.value),
    };

    if ("dateFormat" in props) {
      console.warn("dateFormat已经被弃用, 请使用dateConfig属性配置");
    }

    if ("dateSteps" in props) {
      console.warn("dateSteps已经被弃用, 请使用dateConfig属性配置");
    }

    if ("showFormat" in props) {
      console.warn("headerFormat, 请使用dateConfig属性");
    }

    this.handleFinishBtnClick = this.handleFinishBtnClick.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // update value of state
    const date = nextDate(nextProps.value);
    if (date.getTime() !== this.state.value.getTime()) {
      this.setState({ value: date });
    }
  }

  /**
   * When you swipe two datepickeritems at the same time.
   * Prevent dates from going out.
   */
  componentDidUpdate() {
    const value = this.state.value;
    const { min, max } = this.props;
    if (max && value.getTime() > max.getTime()) {
      this.setState({ value: max });
    }

    if (min && value.getTime() < min.getTime()) {
      this.setState({ value: min });
    }
  }

  /**
   * Optimization component, Prevents unnecessary rendering
   * Only props or state change or value before re-rendering
   *
   * @param  {Object} nextProps next props
   * @param  {Object} nextState next state
   * @return {Boolean}          Whether re-rendering
   */
  shouldComponentUpdate(nextProps, nextState) {
    const date = nextDate(nextState.value);
    return (
      date.getTime() !== this.state.value.getTime() ||
      PureRender.shouldComponentUpdate(
        nextProps,
        nextState,
        this.props,
        this.state
      )
    );
  }

  /**
   * 点击完成按钮事件
   * @return {undefined}
   */
  handleFinishBtnClick() {
    this.props.onSelect(this.state.value);
  }

  /**
   * 选择下一个日期
   * @return {undefined}
   */
  handleDateSelect(value) {
    console.log("value=", value);
    this.setState({ value }, () => {
      this.props.onChange(value);
    });
  }

  /**
   * 格式化dateConfig
   * @param {*} dataConfig dateConfig属性
   */
  normalizeDateConfig(dataConfig) {
    const configList = [];
    if (isArray(dataConfig)) {
      for (let i = 0; i < dataConfig.length; i++) {
        const value = dataConfig[i];
        if (typeof value === "string") {
          const lowerCaseKey = value.toLocaleLowerCase();
          configList.push({
            ...dateConfigMap[lowerCaseKey],
            type: capitalize(lowerCaseKey),
          });
        }
      }
    } else {
      for (const key in dataConfig) {
        if (dataConfig.hasOwnProperty(key)) {
          const lowerCaseKey = key.toLocaleLowerCase();
          if (dateConfigMap.hasOwnProperty(lowerCaseKey)) {
            configList.push({
              ...dateConfigMap[lowerCaseKey],
              ...dataConfig[key],
              type: capitalize(lowerCaseKey),
            });
          }
        }
      }
    }

    return configList;
  }

  /**
   * render函数
   * @return {Object} JSX对象
   */
  render() {
    const {
      min,
      max,
      theme,
      dateConfig,
      confirmText,
      cancelText,
      headerFormat,
      showHeader,
      showFooter,
      customHeader,
      showCaption,
    } = this.props;
    const value = this.state.value;
    const themeClassName =
      ["default", "dark", "ios", "android", "android-dark"].indexOf(theme) ===
      -1
        ? "default"
        : theme;

    const dataConfigList = this.normalizeDateConfig(dateConfig);

    return (
      <div className={`date-time-picker ${themeClassName}`}>
        {showHeader && (
          <div className="date-time-picker-header">
            {customHeader || convertDate(value, headerFormat)}
          </div>
        )}
        <div>
          {showCaption && (
            <div className="date-time-picker-caption">
              {dataConfigList.slice(0, 3).map((item, index) => (
                <div key={index} className="date-time-picker-caption-item">
                  {item.caption}
                </div>
              ))}
            </div>
          )}
          <div className="date-time-picker-content">
            {dataConfigList.slice(0, 3).map((item, index) => (
              <DatePickerItem
                key={index}
                value={value}
                min={min}
                max={max}
                step={item.step}
                type={item.type}
                format={item.format}
                onSelect={(value) => this.handleDateSelect(value, "date")}
                disabledDate={this.props.disabledDate}
              />
            ))}
          </div>
        </div>
        {dataConfigList.slice(3).length > 0 && (
          <div style={{ marginTop: 10 }}>
            {showCaption && (
              <div className="date-time-picker-caption">
                {dataConfigList.slice(3).map((item, index) => (
                  <div key={index} className="date-time-picker-caption-item">
                    {item.caption}
                  </div>
                ))}
              </div>
            )}
            <div className="date-time-picker-content">
              {dataConfigList.slice(3).map((item, index) => (
                <DatePickerItem
                  key={index}
                  value={value}
                  min={min}
                  max={max}
                  step={item.step}
                  type={item.type}
                  format={item.format}
                  onSelect={(value) => this.handleDateSelect(value, "time")}
                  disabledDate={this.props.disabledDate}
                />
              ))}
            </div>
          </div>
        )}

        {showFooter && (
          <div className="date-time-picker-navbar">
            <a
              className="date-time-picker-navbar-btn"
              onClick={this.handleFinishBtnClick}
            >
              {confirmText}
            </a>
            <a
              className="date-time-picker-navbar-btn"
              onClick={this.props.onCancel}
            >
              {cancelText}
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default DateTimePicker;
