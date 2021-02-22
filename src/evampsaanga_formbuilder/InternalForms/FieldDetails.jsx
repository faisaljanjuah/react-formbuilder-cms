import React from 'react';
import * as Yup from 'yup';
import RFB_InternalForm from './Form';

class FieldDetails extends RFB_InternalForm {
    state = {
        inputType: "input",
        errors: {},
        formData: {
            name: '',
            label: '',
            multiple: '',
        },
        schema: {
            name: Yup.string().matches(/^[a-zA-Z0-9_-]+$/, 'Please remove invalid characters').required('Field name is required'),
            label: Yup.string(),
        },
        advanceOpts: false,
        fieldNames: []
    }

    schema = Yup.object().shape(this.state.schema);

    componentDidMount = () => {
        let { inputType, formData, schema } = { ...this.state };
        inputType = this.props.type ? this.props.type : 'input';
        if (inputType === 'select' || inputType === 'radio') {
            formData.options = '';
            schema.options = Yup.string().matches(/^[a-zA-Z0-9 \n_,.'"-]+$/, 'Please remove invalid characters').required('Please insert at least one option');
        }
        if (inputType === 'checkbox') {
            formData.checkboxText = '';
            schema.checkboxText = Yup.string()
        }
        let fieldNames = this.props.fields.map(n => ({ text: n.name }));
        this.setState({ inputType, formData, schema, fieldNames }, () => {
            this.schema = Yup.object().shape(this.state.schema);
        });
    }

    submitForm = () => {
        let { formData, errors, inputType } = { ...this.state };
        if (formData.similar) {
            if (!formData.similarVal) errors.similarVal = 'Please Choose similar field';
            else delete errors.similarVal;
        }
        if (formData.min) {
            if (!formData.minVal || isNaN(parseInt(formData.minVal))) errors.minVal = 'Please specify valid Min number';
            else delete errors.minVal;
            if (!formData.maxVal || isNaN(parseInt(formData.maxVal))) errors.maxVal = 'Please specify valid Max number';
            else delete errors.maxVal;
            if (parseInt(formData.maxVal) <= parseInt(formData.minVal)) errors.maxVal = 'Max number must be greater than Min number';
            if (formData.maxVal && (parseInt(formData.maxVal) > 0) && parseInt(formData.maxVal) >= parseInt(formData.minVal)) delete errors.maxVal;
        }
        this.setState({ errors }, () => {
            if (Object.keys(this.state.errors).length < 1) {
                let id = 0;
                this.props.fields.map(f => f['data-id'] >= id ? id = f['data-id'] + 1 : null);
                formData['data-id'] = id;
                formData['data-class-sm'] = 'col-md-12';
                formData['data-class-lg'] = 'col-lg-4';

                if (inputType === 'file') formData.type = inputType;
                if (formData.multiple !== undefined || formData.multiple !== null) {
                    if (formData.multiple.toString() === '1') formData.multiple = true;
                    else delete formData.multiple;
                }

                let required = parseInt(formData.required) === 1 ? parseInt(formData.required) : null;
                if (required) {
                    if (!formData.requiredTxt) {
                        formData.requiredTxt = `${formData.name} is required`;
                    }
                    formData['data-validation-required'] = formData.requiredTxt;
                }
                delete formData.enable;
                delete formData.required;
                delete formData.requiredTxt;
                delete formData.requiredVal;
                let min = parseInt(formData['min']) === 1 ? parseInt(formData['min']) : null;
                if (min) {
                    let minVal = '';
                    if (formData.minVal.toString().length > 0) minVal = formData.minVal;
                    if (!formData.minTxt) formData.minTxt = 'Value must be greater than ' + minVal;
                    formData['data-validation-min'] = minVal + '___' + formData.minTxt;

                    let maxVal = '';
                    if (formData.maxVal.toString().length > 0) maxVal = formData.maxVal;
                    if (!formData.maxTxt) formData.maxTxt = 'Value must be less than ' + maxVal;
                    formData['data-validation-max'] = maxVal + '___' + formData.maxTxt;
                }
                delete formData.min;
                delete formData.minTxt;
                delete formData.minVal;
                delete formData.maxTxt;
                delete formData.maxVal;

                let similar = parseInt(formData['similar']) === 1 ? parseInt(formData['similar']) : null;
                if (similar) {
                    let similarVal = '';
                    if (formData.similarVal.toString().length > 0) similarVal = formData.similarVal;
                    if (!formData.similarTxt) formData.similarTxt = 'Value must be same as ' + similarVal;
                    formData['data-validation-similar'] = similarVal + '___' + formData.similarTxt;
                }
                delete formData.similar;
                delete formData.similarTxt;
                delete formData.similarVal;

                if (formData.options !== undefined) {
                    formData.options = formData.options.trim().split('\n').filter(v => v && v);
                    formData.options = formData.options.map(o => ({ text: o }));
                }
                this.props.values(this.state.formData);
            }
        });
    }

    advanceOptions = (e) => {
        let advanceOpts = e.currentTarget.checked;
        let { formData, schema } = { ...this.state };
        if (advanceOpts) {
            // Adding Required validation
            formData.required = 0;
            formData.requiredTxt = '';
            schema.required = Yup.string();
            schema.requiredTxt = Yup.string();
            // Adding Min validation
            formData.min = 0;
            formData.minTxt = '';
            formData.minVal = '';
            schema.min = Yup.number();
            schema.minTxt = Yup.string();
            schema.minVal = Yup.string();
            // Adding Max validation
            formData.maxTxt = '';
            formData.maxVal = '';
            schema.maxTxt = Yup.string();
            schema.maxVal = Yup.string();
            // Similar Values Validation
            formData.similar = 0;
            formData.similarTxt = '';
            formData.similarVal = '';
            schema.similar = Yup.number();
            schema.similarTxt = Yup.string();
            schema.similarVal = Yup.string();

        }
        else {
            delete formData.enable;
            // Removing Required validation
            delete formData.required;
            delete formData.requiredTxt;
            delete formData.requiredVal;
            delete schema.required;
            delete schema.requiredTxt;
            // Removing enabling range Check
            delete formData.min;
            delete schema.min;
            // Removing Min Validation
            delete formData.minTxt;
            delete formData.minVal;
            delete schema.minTxt;
            delete schema.minVal;
            // Removing Max Validation
            delete formData.maxTxt;
            delete formData.maxVal;
            delete schema.maxTxt;
            delete schema.maxVal;
            // Removing Similar Field Validation
            delete formData.similar;
            delete formData.similarTxt;
            delete formData.similarVal;
            delete schema.similar;
            delete schema.similarTxt;
            delete schema.similarVal;
        }
        this.setState({ advanceOpts, formData, schema }, () => {
            this.schema = Yup.object().shape(this.state.schema);
        });
    }

    changeRequiredField = (e) => {
        if (!e.currentTarget.checked) {
            let name = e.currentTarget.name;
            let nameTxt = e.currentTarget.name + 'Txt';
            let nameVal = e.currentTarget.name + 'Val';
            let { formData, errors } = { ...this.state };
            formData[nameTxt] = '';
            formData[nameVal] = '';
            delete errors[nameTxt];
            delete errors[nameVal];
            if (name === 'min') {
                formData['maxTxt'] = '';
                formData['maxVal'] = '';
                delete errors['maxTxt'];
                delete errors['maxVal'];
            }
            this.setState({ formData, errors });
        }
    }

    render() {
        const { inputType, advanceOpts, fieldNames } = this.state;
        const { name, label, type, multiple, options, checkboxText, required, requiredTxt, min, minVal, minTxt, maxVal, maxTxt, similar, similarVal, similarTxt } = this.state.formData;

        const inputOpts = [
            { text: 'Password', value: 'password' },
            { text: 'Email', value: 'email' },
            { text: 'Number', value: 'number' },
            { text: 'Date', value: 'date' }
        ];
        const btnType = [
            { text: 'Submit', value: 'submit' },
            { text: 'Button', value: 'button' },
            { text: 'Reset', value: 'reset' }
        ];


        const form = {
            name: { placeholder: 'Field Name', value: name },
            label: { placeholder: 'Field Label', value: label },

            type: { options: inputOpts, value: type },
            btnType: { options: btnType, value: type },
            multiple: { checkboxText: 'Allow Multiple', value: multiple },


            options: { placeholder: 'Field Options', value: options, description: 'Insert one option per line' },
            checkboxText: { placeholder: 'Checkbox Text', value: checkboxText },

            submitBtn: { label: 'Save', type: 'submit', className: 'btn btn-primary' }
        };

        let thisName = name ? name : 'This';

        const advanceFields = {
            enable: { checkboxText: 'Advance Options', onChange: this.advanceOptions },

            required: { checkboxText: 'Required ?', value: required, onChange: this.changeRequiredField },
            requiredTxt: { placeholder: 'Error Message', value: requiredTxt, disabled: !required, description: 'Default error message is "' + thisName + ' is required"' },

            min: { checkboxText: 'Set Min & Max values', value: min, onChange: this.changeRequiredField },
            minVal: { placeholder: 'Min Number', value: minVal, disabled: !min },
            minTxt: { placeholder: 'Error Message', value: minTxt, disabled: !min, description: 'Default error message is "Value must be greater than ' + minVal + '"' },
            maxVal: { placeholder: 'Max Number', value: maxVal, disabled: !min },
            maxTxt: { placeholder: 'Error Message', value: maxTxt, disabled: !min, description: 'Default error message is "Value must be less than ' + maxVal + '"' },

            similar: { checkboxText: 'Similar', value: similar, onChange: this.changeRequiredField },
            similarVal: { value: similarVal, disabled: !similar, options: fieldNames },
            similarTxt: { placeholder: 'Error Message', value: similarTxt, disabled: !similar, description: 'Default error message is "Value must be same as ' + similarVal + '"' },

        }

        return (
            <React.Fragment>
                <h2>Add field details</h2>
                <form onSubmit={this.ValidateAndSubmit}>
                    <div className="rfb_FieldDetails">

                        {this.insertInput({ name: form.name })}
                        {this.insertInput({ label: form.label })}

                        {(inputType === 'button') && this.insertSelect({ type: form.btnType })}

                        {(inputType === 'input') && this.insertSelect({ type: form.type })}

                        {(inputType === 'file') && this.insertCheckbox({ multiple: form.multiple })}
                        {/* {(inputType === 'select' || inputType === 'file') && this.insertCheckbox({ multiple: form.multiple })} */}

                        {(inputType === 'select' || inputType === 'radio') && this.insertTextarea({ options: form.options })}
                        {(inputType === 'checkbox') && this.insertInput({ checkboxText: form.checkboxText })}

                        <div className="showAdvanceOptions">{this.insertCheckbox({ enable: advanceFields.enable })}</div>

                        {advanceOpts && <div className="showOptions">
                            <div className="optionRow">
                                {this.insertCheckbox({ required: advanceFields.required })}
                                {this.insertInput({ requiredTxt: advanceFields.requiredTxt })}
                            </div>
                            <div className="optionRow">
                                {this.insertCheckbox({ min: advanceFields.min })}
                                <div className="concatFields">
                                    {this.insertInput({ minVal: advanceFields.minVal })}
                                    {this.insertInput({ minTxt: advanceFields.minTxt })}
                                </div>
                                <div className="concatFields">
                                    {this.insertInput({ maxVal: advanceFields.maxVal })}
                                    {this.insertInput({ maxTxt: advanceFields.maxTxt })}
                                </div>
                            </div>
                            <div className="optionRow">
                                {this.insertCheckbox({ similar: advanceFields.similar })}
                                <div className="concatFields">
                                    {this.insertSelect({ similarVal: advanceFields.similarVal })}
                                    {this.insertInput({ similarTxt: advanceFields.similarTxt })}
                                </div>
                            </div>
                        </div>}
                    </div>
                    {this.insertButton({ submitBtn: form.submitBtn })}
                </form>
            </React.Fragment>
        );
    }
}

export default FieldDetails;