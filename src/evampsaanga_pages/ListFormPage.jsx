import React from 'react';
import * as Yup from 'yup';
import Form from './../evampsaanga_formbuilder/InternalForms/Form';
import { getLocalStorage } from '../evampsaanga_jsFiles/localStorage';

class ListFormPage extends Form {
    state = {
        errors: {},
        formData: {

        },
        form: [],
        schema: {},
        forms: [],
        current: ''
    }
    schema = Yup.object().shape(this.state.schema);

    componentDidMount = () => {
        let forms = getLocalStorage('formcollection');
        if (forms.length > 0) this.setState({ forms });
    }

    renderForm = (i) => {
        if (i > -1) {
            let { forms } = this.state;
            if (forms[i].fields) {
                let { fields } = forms[i];
                let { formData, schema } = { ...this.state };
                fields && fields.map(f => {
                    if (f['data-function'] !== 'button') {
                        formData[f.name] = '';
                        let scheme = Yup.string();
                        if (f.type === 'email') {
                            scheme = scheme.email('Please enter valid email address');
                        }
                        if (f['data-validation-similar'] !== undefined) {
                            let v = f['data-validation-similar'].split('___');
                            scheme = scheme.oneOf([Yup.ref(v[0]), null], v[1]);
                        }
                        if (f['data-validation-min'] !== undefined) {
                            let v = f['data-validation-min'].split('___');
                            scheme = scheme.min(v[0], v[1]);
                        }
                        if (f['data-validation-max'] !== undefined) {
                            let v = f['data-validation-max'].split('___');
                            scheme = scheme.max(v[0], v[1]);
                        }
                        if (f['data-validation-required'] !== undefined) {
                            scheme = scheme.required(f['data-validation-required']);
                        }
                        schema[f.name] = scheme;
                    }
                    return null;
                });
                fields && fields.map(f => {
                    f['containerClass'] = f['data-class-sm'] + ' ' + f['data-class-lg'];
                    delete f['data-id'];
                    delete f['data-validation-min'];
                    delete f['data-validation-max'];
                    delete f['data-validation-similar'];
                    delete f['data-validation-required'];
                    return f
                });
                this.setState({ formData, schema, current: i, errors: {}, form: fields }, () => {
                    this.schema = Yup.object().shape(this.state.schema);
                });
            }
            else {
                this.setState({ current: i, form: [], errors: {} });
            }
        }
    }

    submitForm = () => {
        console.log(this.state.formData);
    }

    render() {
        const { form, formData, forms, current } = this.state;
        return (
            <div className="page-list-form">
                <ul className="formsCollection">
                    {forms.map((f, i) => <li key={i} onClick={() => this.renderForm(i)} className={i === current ? 'active' : ''}><span>{f.name}</span></li>)}
                </ul>
                <hr />
                <form onSubmit={this.ValidateAndSubmit}>
                    <div className="row">
                        {
                            form && form.map((field, k) => {
                                field.key = k;
                                field.value = formData[field.name];
                                return (field['data-function'] === 'select')
                                    ? this.insertSelect({ [field.name]: field })
                                    : (field['data-function'] === 'checkbox')
                                        ? this.insertCheckbox({ [field.name]: field })
                                        : (field['data-function'] === 'radio')
                                            ? this.insertRadio({ [field.name]: field })
                                            : (field['data-function'] === 'textarea')
                                                ? this.insertTextarea({ [field.name]: field })
                                                : (field['data-function'] === 'button')
                                                    ? this.insertButton({ [field.name]: field })
                                                    : this.insertInput({ [field.name]: field })
                            }
                            )
                        }
                    </div>
                </form>
            </div>
        );
    }
}

export default ListFormPage;