import React from 'react';
import * as Yup from 'yup';
import RFB_InternalForm from './Form';

class FormChooseFieldType extends RFB_InternalForm {
    state = {
        errors: {},
        formData: {
            chooseField: 'input',
        }
    }

    schema = Yup.object().shape({
        chooseField: Yup.string().required('Please choose at least one option')
    });

    submitForm = () => {
        this.props.type(this.state.formData.chooseField);
    }

    render() {
        const { chooseField } = this.state.formData;
        const form = {
            chooseField: {
                value: chooseField, options: [
                    { text: 'Text Field', value: 'input' },
                    { text: 'Dropdown', value: 'select' },
                    { text: 'File', value: 'file' },
                    { text: 'Options', value: 'radio' },
                    { text: 'Checks', value: 'checkbox' },
                    { text: 'Multiline Text', value: 'textarea' },
                    { text: 'Button', value: 'button' },
                ]
            },
            submitBtn: { label: 'Add Field', type: 'submit', className: 'btn btn-primary' }
        };
        return (
            <React.Fragment>
                <h2>Choose field type</h2>
                <form onSubmit={this.ValidateAndSubmit}>
                    <div className="rfb_FieldTypeOptions">
                        {this.insertRadio({ chooseField: form.chooseField })}
                    </div>
                    {this.insertButton({ submitBtn: form.submitBtn })}
                </form>
            </React.Fragment>
        );
    }
}

export default FormChooseFieldType;