/*!
 **********************************************************************
 
 **********************************************************************
 */

import React, { Component } from 'react';
// import Joi from 'joi-browser';

// Class for Creating Dynamic Forms
class Form extends Component {
  state = {
    formData: {},
    errors: {}
  };

  // error mapping in validations
  extractErrors = (err) => {
    let errors = {};
    err && err.inner && err.inner.map(e => errors[e.path] = e.message);
    return errors;
  }

  // Event for validating single field
  onChangeField = ({ currentTarget: field }) => {
    const { name, value } = field;
    let { formData } = { ...this.state };
    if (field.type === 'checkbox') field.checked ? formData[name] = 1 : formData[name] = 0;
    else formData[name] = value;
    this.setState({ formData }, async () => {
      if (field.type === 'date' || field.getAttribute('data-fieldvalidate') !== 'onblur') {
        const values = this.state.formData;
        const errors = { ...this.state.errors };
        let error = {};
        try {
          await this.schema.validate(values, { abortEarly: false });
        } catch (err) {
          error = this.extractErrors(err);
        }
        error.hasOwnProperty(name) ? errors[name] = error[name] : delete errors[name];
        this.setState({ errors, formData }, () => {
          // console.log(this.state);
        });
      }
    });
  }

  onBlurField = async ({ currentTarget: field }) => {
    const { name } = field;
    const errors = { ...this.state.errors };
    let error = {};
    try {
      await this.schema.validate(this.state.formData, { abortEarly: false });
    } catch (err) {
      error = this.extractErrors(err);
    }
    error.hasOwnProperty(name) ? errors[name] = error[name] : delete errors[name];
    this.setState({ errors });
  }

  // validateForm = () => {

  // }

  // Method for validating Whole Form
  // validateForm = async () => {
  //   let errors = {};
  //   try {
  //     await this.schema.validate(this.state.formData, { abortEarly: false });
  //     return null;
  //   } catch (err) {
  //     errors = this.extractErrors(err);
  //   }
  //   if (Object.keys(errors).length > 0) return errors;
  // };

  // Event for validating whole form
  validateAndSubmit = async (e) => {
    e.preventDefault();
    const values = this.state.formData;
    let errors = {};
    try {
      await this.schema.validate(values, { abortEarly: false });
      errors = {};
    } catch (err) {
      errors = this.extractErrors(err);
      console.log(Object.keys(errors).length + ' field(s) has errors', errors);
    }
    // const errors = this.validateForm();
    this.setState({ errors: errors || {} });
    // Form is valid and Do Submit
    if (Object.keys(errors).length < 1) {
      console.log('valid Form:', this.state);
      this.submitForm();
    }
    else { console.log('InValid Form:', this.state); }
  };

  /* =======Fields Start Here======= */
  // Creating single Input Field
  insertInput(props) {
    const name = Object.keys(props)[0];
    const { label, value, type = 'text', containerClass = "", ...rest } = props[name];
    const { errors } = this.state;
    const fieldClass = rest.className ? rest.className : '';
    let divClass = containerClass ? containerClass + ' ' : '';
    return (
      <div className={divClass + `form-group input-field field-group-${name}${(errors && errors[name] ? ' has-error error-' + name : '')}`}>
        {label && <label htmlFor={name}>{label}</label>}
        <input
          data-fieldvalidate='onblur'
          {...rest}
          id={name}
          name={name}
          type={type}
          autoComplete="off"
          value={value}
          onBlur={
            e => {
              this.onBlurField(e);
              rest.onBlur && rest.onBlur(e);
            }
          }
          onChange={
            e => {
              this.onChangeField(e);
              rest.onChange && rest.onChange(e);
            }
          }
          className={(`form-control field-${name} ${fieldClass}`).trim()}
        />
        {errors && errors[name] && <div className="error">{errors[name]}</div>}
      </div>
    );
  }

  // Creating single Textarea Field
  insertTextarea(props) {
    const name = Object.keys(props)[0];
    const { label, value, containerClass = "", ...rest } = props[name];
    const { errors } = this.state;
    const fieldClass = rest.className ? rest.className : '';
    let divClass = containerClass ? containerClass + ' ' : '';
    return (
      <div className={divClass + `form-group textarea-field field-group-${name}${(errors && errors[name] ? ' has-error error-' + name : '')}`}>
        {label && <label htmlFor={name}>{label}</label>}
        <textarea
          data-fieldvalidate='onblur'
          {...rest}
          id={name}
          name={name}
          autoComplete="off"
          value={value}
          onBlur={
            e => {
              this.onBlurField(e);
              rest.onBlur && rest.onBlur(e);
            }
          }
          onChange={
            e => {
              this.onChangeField(e);
              rest.onChange && rest.onChange(e);
            }
          }
          className={(`form-control field-${name} ${fieldClass}`).trim()}
        ></textarea>
        {errors && errors[name] && <div className="error">{errors[name]}</div>}
      </div>
    );
  }

  // Creating Select
  insertSelect(props) {
    const name = Object.keys(props)[0];
    const { label, value, firstOption, options, containerClass = "", ...rest } = props[name];
    let firstSelect = (firstOption === undefined || Object.keys(firstOption).length === 0) ? <option value="">--Select--</option> : null;
    if (typeof firstOption === 'object') {
      let firstOptionText = firstOption.text;
      if (firstOptionText) {
        let firstOptionValue = firstOption.value === undefined ? '' : firstOption.value;
        firstSelect = <option value={firstOptionValue}>{firstOptionText}</option>;
      }
      if (firstOption.render === false) firstSelect = null;
    }
    const { errors } = this.state;
    const fieldClass = rest.className ? rest.className : '';
    let divClass = containerClass ? containerClass + ' ' : '';
    return (
      <div className={divClass + `form-group select-field field-group-${name}${(errors && errors[name] ? ' has-error error-' + name : '')}`}>
        {label && <label htmlFor={name}>{label}</label>}
        <select
          {...rest}
          id={name}
          name={name}
          onChange={
            e => {
              this.onChangeField(e);
              rest.onChange && rest.onChange(e);
            }
          }
          className={(`form-control field-${name} ${fieldClass}`).trim()}
          value={value}
        >
          {firstSelect}
          {options.map((o, k) => <option key={k} value={(o.value === undefined || o.value === null) ? o.text : o.value}>{o.text}</option>)}
        </select>
        {errors && errors[name] && <div className="error">{errors[name]}</div>}
      </div>
    );
  }

  // Creating Radio Field
  insertRadio(props) {
    const name = Object.keys(props)[0];
    const { label, value, radioName, containerClass = "", ...rest } = props[name];
    const { errors } = this.state;
    const fieldClass = rest.className ? rest.className : '';
    let divClass = containerClass ? containerClass + ' ' : '';
    return (
      <div className={divClass + `form-group radio-field field-group-${name}${(errors && errors[name] ? ' has-error error-' + name : '')}`}>
        <div className="optionField radioOption">
          <input
            {...rest}
            id={name}
            value={value}
            name={radioName}
            type="radio"
            autoComplete="off"
            onChange={
              e => {
                this.onChangeField(e);
                rest.onChange && rest.onChange(e);
              }
            }
            className={(`field-${name} ${fieldClass}`).trim()}
          />
          <label htmlFor={name}>{label}</label>
          {errors && errors[name] && <div className="error">{errors[name]}</div>}
        </div>
      </div>
    );
  }

  // Creating Checkbox Field
  insertCheckbox(props) {
    const name = Object.keys(props)[0];
    const { label, value, containerClass = "", ...rest } = props[name];
    const { errors } = this.state;
    const fieldClass = rest.className ? rest.className : '';
    let divClass = containerClass ? containerClass + ' ' : '';
    return (
      <div className={divClass + `form-group checkbox-field field-group-${name}${(errors && errors[name] ? ' has-error error-' + name : '')}`}>
        <div className="optionField checkboxOption">
          <input
            {...rest}
            id={name}
            name={name}
            value={value}
            type="checkbox"
            checked={value ? true : false}
            autoComplete="off"
            onChange={
              e => {
                this.onChangeField(e);
                rest.onChange && rest.onChange(e);
              }
            }
            className={(`field-${name} ${fieldClass}`).trim()}
          />
          <label htmlFor={name}>{label}</label>
          {errors && errors[name] && <div className="error">{errors[name]}</div>}
        </div>
      </div>
    );
  }

  // Creating Button Field
  insertButton(props) {
    const name = Object.keys(props)[0];
    const { label, type = "button", containerClass = "", ...rest } = props[name];
    let divClass = containerClass ? containerClass + ' ' : '';
    if (type.toLowerCase() === 'reset') {
      let { formData, errors } = { ...this.state };
      const resetForm = () => {
        for (let formItem in formData) {
          if (this.schema[formItem]._type === 'array') formData[formItem] = [];
          else formData[formItem] = '';
        }
        errors = {};
        this.setState({ formData, errors });
      }
      return <div className={divClass}><button
        id={name}
        type={type}
        {...rest}
        onClick={e => {
          resetForm();
          rest.onClick && rest.onClick(e);
        }}
      // onClick={() => resetForm()}
      >{label}</button></div>;
    }
    else if (type.toLowerCase() === 'button') {
      return <div className={divClass}><button
        id={name}
        type={type}
        onClick={e => {
          rest.onClick && rest.onClick(e);
        }}
        {...rest}
      >{label}</button></div>;
    }
    else {
      return <div className={divClass}><button
        id={name}
        type={type}
        onClick={e => {
          rest.onClick && rest.onClick(e);
        }}
        {...rest}
      >{label}</button></div>;
    }
  }
}

export default Form;