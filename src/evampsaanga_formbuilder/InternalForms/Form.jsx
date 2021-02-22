import React, { Component } from 'react';

class RFB_InternalForm extends Component {
    state = {
        formData: {},
        errors: {}
    };

    extractErrors = (err) => {
        let errors = {};
        err && err.inner && err.inner.map(e => errors[e.path] = e.message);
        return errors;
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
    onChangeField = async ({ currentTarget: field }) => {
        const { name, value } = field;
        let { formData } = this.state;
        if (field.type === 'checkbox') field.checked ? formData[name] = 1 : formData[name] = 0;
        else formData[name] = value;
        this.setState({ formData }, async () => {
            const values = this.state.formData;
            const { errors } = this.state;
            let error = {};
            try {
                await this.schema.validate(values, { abortEarly: false });
            } catch (err) {
                error = this.extractErrors(err);
            }
            error.hasOwnProperty(name) ? errors[name] = error[name] : delete errors[name];
            this.setState({ errors, formData });
        });
    }
    ValidateAndSubmit = async (e) => {
        e.preventDefault();
        let values = { ...this.state.formData };
        for (let k in values) { if (typeof values[k] === 'string') values[k] = values[k].trim(); }
        let errors = {};
        try {
            await this.schema.validate(values, { abortEarly: false });
            console.log(JSON.stringify(values, null, 2));
            errors = {};
        } catch (err) {
            errors = this.extractErrors(err);
            console.log('ErrorsOnSubmit:', errors);
            console.log(Object.keys(errors).length + ' field(s) has errors');
        }
        this.setState({ errors, formData: values });
        if (Object.keys(errors).length < 1) {
			if (typeof this.submitForm === "function") this.submitForm(true);
			else console.log("Function submitForm() not exist.");
        }
    };

    insertInput(props) {
        const name = Object.keys(props)[0];
        const { key, label, value, type = 'text', containerClass = "", description, ...rest } = props[name];
        const { errors } = this.state;
        const fieldClass = rest.className ? rest.className : '';
        const wrapperClass = containerClass ? containerClass + ' ' : '';
        return (
            <div key={key} className={(errors && errors[name]) ? wrapperClass + 'fieldContainer input-field has-error error-' + name : wrapperClass + 'fieldContainer input-field'}>
                {/* <div className={'input-field'}> */}
                {label && <label htmlFor={name}>{label}</label>}
                <input
                    {...rest}
                    id={name}
                    name={name}
                    type={type}
                    autoComplete="off"
                    value={value}
                    onChange={
                        e => {
                            this.onChangeField(e);
                            rest.onChange && rest.onChange(e);
                        }
                    }
                    className={(`internalField field-${name} ${fieldClass}`).trim()}
                />
                {description && <span className="fieldDescription">{description}</span>}
                {errors && errors[name] && <div className="error">{errors[name]}</div>}
            </div>
        );
    }
    // Creating Select
    insertSelect(props) {
        const name = Object.keys(props)[0];
        const { key, label, value, firstOption, options, containerClass = "", description, ...rest } = props[name];
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
        const wrapperClass = containerClass ? containerClass + ' ' : '';
        return <div key={key} className={(errors && errors[name]) ? wrapperClass + 'fieldContainer select-field has-error error-' + name : wrapperClass + 'fieldContainer select-field'}>
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
                className={(`internalField field-${name} ${fieldClass}`).trim()}
                value={value}
            >
                {firstSelect}
                {options && options.map((o, k) => <option key={k} value={(o.value === undefined || o.value === null) ? o.text : o.value}>{o.text}</option>)}
            </select>
            {description && <span className="fieldDescription">{description}</span>}
            {errors && errors[name] && <div className="error">{errors[name]}</div>}
        </div>;
    }
    // Creating single Textarea Field
    insertTextarea(props) {
        const name = Object.keys(props)[0];
        const { key, label, value, containerClass = "", description, ...rest } = props[name];
        const { errors } = this.state;
        const fieldClass = rest.className ? rest.className : '';
        const wrapperClass = containerClass ? containerClass + ' ' : '';
        return <div key={key} className={(errors && errors[name]) ? wrapperClass + 'fieldContainer textarea-field has-error error-' + name : wrapperClass + 'fieldContainer textarea-field'}>
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
                className={(`internalField field-${name} ${fieldClass}`).trim()}
            ></textarea>
            {description && <span className="fieldDescription">{description}</span>}
            {errors && errors[name] && <div className="error">{errors[name]}</div>}
        </div>;
    }
    // Creating Checkbox Field
    insertCheckbox(props) {
        const name = Object.keys(props)[0];
        const { key, label, value, type = "checkbox", checkboxText = "", containerClass = "", description, ...rest } = props[name];
        const { errors } = this.state;
        const fieldClass = rest.className ? rest.className : '';
        const wrapperClass = containerClass ? containerClass + ' ' : '';
        return <div key={key} className={(errors && errors[name]) ? wrapperClass + 'fieldContainer checkbox-field has-error error-' + name : wrapperClass + 'fieldContainer checkbox-field'}>
            {label && <label>{label}</label>}
            <div className="rfb_InputOption rfb_checkbox">
                <input
                    {...rest}
                    id={name}
                    name={name}
                    value={value}
                    type={type ? 'checkbox' : 'checkbox'}
                    checked={value ? true : false} // render on runtime and check its functionality
                    onChange={
                        e => {
                            this.onChangeField(e);
                            rest.onChange && rest.onChange(e);
                        }
                    }
                    className={(`field-${name} ${fieldClass}`).trim()}
                />
                <label htmlFor={name}>{checkboxText}</label>
                {description && <span className="fieldDescription">{description}</span>}
                {errors && errors[name] && <div className="error">{errors[name]}</div>}
            </div>
        </div>;
    }

    insertRadio(props) {
        const name = Object.keys(props)[0];
        const { key, label, value, options, type = "radio", containerClass = "", description, ...rest } = props[name];
        const { errors } = this.state;
        const fieldClass = rest.className ? rest.className : '';
        const wrapperClass = containerClass ? containerClass + ' ' : '';
        return <div key={key} className={(errors && errors[name]) ? wrapperClass + 'fieldContainer radio-field has-error error-' + name : wrapperClass + 'fieldContainer radio-field'}>
            {label && <label>{label}</label>}
            <div className="radioOptionsWrapper">
                {options && options.map((r, k) => <div key={k} className="rfb_InputOption rfb_radio">
                    <input
                        {...rest}
                        id={name + '_' + (r.text && r.text.replace(/[^A-Za-z0-9_-]/g, ''))}
                        name={name}
                        type={type ? 'radio' : 'radio'}
                        value={r.value ? r.value : (r.text ? r.text : '')}
                        checked={(value === (r.value ? r.value : r.text)) ? true : false}
                        className={(`field-${name} ${fieldClass} ${r.className ? r.className : r.class ? r.class : ''}`).trim()}
                        onChange={
                            e => {
                                this.onChangeField(e);
                                rest.onChange && rest.onChange(e);
                                r.onChange && r.onChange(e);
                            }
                        }
                    />
                    <label htmlFor={name + '_' + (r.text && r.text.replace(/[^A-Za-z0-9_-]/g, ''))}>{r.text ? r.text : ''}</label>
                </div>)}
            </div>
            {description && <span className="fieldDescription">{description}</span>}
            {errors && errors[name] && <div className="error">{errors[name]}</div>}
        </div>;
    }

    // Creating Button Field
    insertButton(props) {
        const name = Object.keys(props)[0];
        const { key, label, type = "button", containerClass = "", ...rest } = props[name];
        const divClass = containerClass ? containerClass + ' ' : '';
        const btnClass = rest.className ? rest.className : 'btn btn-primary';
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
            return <div key={key} className={divClass + 'fieldContainer button-field'}><button className={btnClass} id={name} type={type} {...rest} onClick={() => resetForm()}>{label}</button></div>;
        }
        else {
            return <div key={key} className={divClass + 'fieldContainer button-field'}><button className={btnClass} id={name} type={type} {...rest}>{label}</button></div>;
        }
    }
}

export default RFB_InternalForm;