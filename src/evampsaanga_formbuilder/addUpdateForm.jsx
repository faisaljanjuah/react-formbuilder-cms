import React from 'react';
import * as Yup from 'yup';
import RFB_InternalForm from './InternalForms/Form';

import FormChooseFieldType from './InternalForms/formChooseField';
import FieldDetails from './InternalForms/FieldDetails';
import FieldWidth from './InternalForms/FieldWidth';


class AddUpdateForm extends RFB_InternalForm {
    formNameField = React.createRef();
    formNames = this.props.formNames.map(n => n.toLowerCase());
    state = {
        errors: {},
        editName: false,
        previousName: '',
        addFieldType: '',
        deleteId: '',
        currentLayout: 'desktop',
        changeWidthPopup: false,
        addNewFieldPopup: false,
        addNewFieldInfoPopup: false,
        dragging: false,
        changeWidthDetails: {},
        zone: {
            startId: 0,
            enteredId: 0,
            exitId: 0,
            dropId: 0,
            gotZone: false,
        },
        formData: {
            name: '',
            apiEndpoint: ''
        },
        oldFormData: {},
        fields: [],
        oldFields: []
    }
    schema = Yup.object().shape({
        name: Yup.lazy(v => {
            let value = v.trim().toLowerCase();
            let currentName = this.state.previousName.toLowerCase();
            if (currentName !== value && this.formNames.indexOf(value) > -1) return Yup.string().notOneOf([v], 'Form with same name already exist').matches(/^[a-zA-Z0-9 _-]+$/, 'Please remove invalid characters').min(3, 'Form name must be 3 characters long').max(40, 'Form Name must not exceed 40 characters').required('Form name is required');
            else return Yup.string().matches(/^[a-zA-Z0-9 _-]+$/, 'Please remove invalid characters').min(3, 'Form name must be 3 characters long').max(40, 'Form Name must not exceed 40 characters').required('Form name is required');
        }),
        apiEndpoint: Yup.string().matches(/^[a-zA-Z0-9_-]+$/, 'Please remove invalid characters').required('API endpoint is required')
    });

    componentDidMount = () => {
        window.addEventListener('keyup', this.closeAddNewFieldPopup);
        const formData = { ...this.props.form }; // if not Cloned, it will submit values even on pressing cancel
        const { newForm } = { ...this.props };
        let previousName = this.props.form.name;
        let editName = { ...this.state.editName };
        let { fields, oldFields, oldFormData } = { ...this.state };
        if (formData.name.length < 1) editName = false;
        if (formData.fields !== undefined) {
            oldFields = [...formData.fields];
            fields = [...formData.fields];
            delete formData.fields;
        }
        oldFormData = formData;
        this.setState({ formData, oldFormData, fields, oldFields, newForm, editName, previousName });
    }
    componentWillUnmount = () => {
        window.removeEventListener('keyup', this.closeAddNewFieldPopup);
    }

    editFormName = () => {
        this.setState({ editName: false }, () => {
            this.formNameField.current.focus();
        });
    }
    addNewFieldPopup = () => {
        this.setState({ addNewFieldPopup: true });
    }
    closeAddNewFieldPopup = (e) => {
        let { addNewFieldInfoPopup } = this.state;
        if (e.keyCode === 27 || e.button === 0) addNewFieldInfoPopup ? this.setState({ addNewFieldInfoPopup: false }) : this.setState({ addNewFieldPopup: false });
        if (e.which === 46) {
            let { fields, deleteId } = { ...this.state };
            if (typeof deleteId === 'number') {
                fields.splice(deleteId, 1);
                this.setState({ fields, deleteId: '' });
            }
        }
        else this.setState({ deleteId: '' });
    }
    chosenType = (v) => {
        this.setState({ addNewFieldInfoPopup: true, addFieldType: v }, () => {
            console.log(this.state);
        });
    }
    saveFieldInfo = (values) => {
        values['data-function'] = this.state.addFieldType;
        let { fields, addNewFieldPopup, addNewFieldInfoPopup } = this.state;
        addNewFieldPopup = false;
        addNewFieldInfoPopup = false;
        fields.push(values);
        this.setState({ fields, addNewFieldPopup, addNewFieldInfoPopup });
    }

    changeWidth = (field) => {
        this.setState({ changeWidthDetails: field, changeWidthPopup: true });
    }
    updateWidth = (r) => {
        let sm = 'col-md-' + r.sm;
        let lg = 'col-lg-' + r.lg;
        let { fields } = { ...this.state };
        let index = fields.findIndex(i => i['data-id'] === r.id);
        fields[index]['data-class-sm'] = sm;
        fields[index]['data-class-lg'] = lg;
        this.setState({ fields });
    }

    submitForm = (e) => {
        let { fields, oldFields, formData, oldFormData } = { ...this.state };
        if (e) {
            formData.fields = fields;
            this.props.getChanges(formData);
        }
        else {
            formData = oldFormData;
            formData.fields = oldFields;
        }
        this.props.editMode(false);
    }
    deleteField = (k) => {
        let { fields, deleteId } = { ...this.state };
        if (deleteId === k) {
            fields.splice(k, 1);
            deleteId = '';
            // fields = fields.map((f, k) => {
            //     let field = { ...f };
            //     field['data-id'] = k;
            //     return field;
            // });
        }
        else { deleteId = k; }
        this.setState({ fields, deleteId });
    }


    dragPosition = (arr, fromIndex, toIndex) => {
        const element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr;
    }
    // Dragger Code Start
    dragStart = (e) => {
        let { zone, dragging } = this.state;
        dragging = true;
        zone.startId = e.currentTarget.getAttribute('data-colnumber');
        this.setState({ zone, dragging });
    }
    dragEnter = (e) => {
        e.currentTarget.classList.add('dragOver');
        let { zone } = this.state;
        zone.enteredId = e.currentTarget.getAttribute('data-colnumber');
        this.setState({ zone });
    }
    dragLeave = (e) => {
        let currentTarget = e.currentTarget;
        setTimeout(() => {
            const elms = document.querySelectorAll('.draggable');
            elms.forEach((e) => { e.classList.remove('dragOver'); });
            let { zone, dragging } = this.state;
            zone.exitId = currentTarget.getAttribute('data-colnumber');
            if (!dragging) { zone.gotZone = true; }
            else { zone.gotZone = false; }
            this.setState({ zone }, () => {
                if (!dragging && zone.gotZone) {
                    let { fields } = { ...this.state };
                    let from = parseInt(zone.startId);
                    let to = parseInt(zone.exitId);
                    fields = this.dragPosition(fields, from, to);
                    this.setState({ fields });
                }
            });
        }, 10);
    }
    dragEnd = (e) => {
        let { zone, dragging } = this.state;
        dragging = false;
        zone.dropId = e.currentTarget.getAttribute('data-colnumber');
        this.setState({ zone, dragging });
    }
    // Dragger Code End

    render() {
        const { editName, currentLayout, changeWidthPopup, changeWidthDetails, addNewFieldPopup, addNewFieldInfoPopup, addFieldType: fieldType, dragging, fields, deleteId } = this.state;
        const { name, apiEndpoint } = this.state.formData;
        const disableFormName = editName ? true : false;

        const form = {
            name: { value: name, ref: this.formNameField, disabled: disableFormName, className: 'rfb_InputHeading', placeholder: 'Form Name' },
            apiEndpoint: { value: apiEndpoint, placeholder: 'API Endpoint', containerClass: 'd-flex align-items-center' }
        };

        return (
            <div className="rfb_AddUpdateFormPage">
                {
                    addNewFieldPopup && <div className="rfb_PopupOverlay d-flex align-items-center justify-content-center">
                        <div className="rfb_PopupContainer rfb_AddNewFieldPopup">
                            <span className="rfb_ClosePopup" onClick={this.closeAddNewFieldPopup}>&#10005;</span>
                            <FormChooseFieldType type={this.chosenType} />
                        </div>
                    </div>
                }
                {
                    addNewFieldInfoPopup && <div className="rfb_PopupOverlay d-flex align-items-center justify-content-center">
                        <div className="rfb_PopupContainer rfb_AddNewFieldInfoPopup">
                            <span className="rfb_ClosePopup" onClick={this.closeAddNewFieldPopup}>&#10005;</span>
                            <FieldDetails fields={fields} type={fieldType} values={this.saveFieldInfo} />
                        </div>
                    </div>
                }
                {
                    changeWidthPopup && <div className="rfb_PopupOverlay d-flex align-items-center justify-content-center">
                        <div className="rfb_PopupContainer rfb_AddNewFieldInfoPopup">
                            <span className="rfb_ClosePopup" onClick={() => this.setState({ changeWidthPopup: false })}>&#10005;</span>
                            <FieldWidth getField={changeWidthDetails} updateWidth={this.updateWidth} showWidthPopup={e => this.setState({ changeWidthPopup: e })} />
                        </div>
                    </div>
                }
                <form className="d-flex flex-column" onSubmit={this.ValidateAndSubmit}>
                    <div className="d-flex flex-column rfb_FormHeader">
                        <div className="d-flex rfb_FormName">
                            {this.insertInput({ name: form.name })}
                            {disableFormName && <span className="rfb_BtnEditFormName" onClick={this.editFormName}></span>}
                        </div>
                    </div>
                    <div className="rfb_FormBody">
                        <div className="rfb_BodyHeader">
                            <div className="d-flex justify-content-between">
                                <div className="d-flex rfb_FormURL">
                                    <div className="d-flex align-items-center rfb_FormBaseURL">
                                        <span>http://baseurl.com/apis/controller/</span>
                                    </div>
                                    {this.insertInput({ apiEndpoint: form.apiEndpoint })}
                                </div>
                                <div className="rfb_LayoutButtons">
                                    <button type="button" className="btn btn-icon rfb_BtnLayoutMobile" onClick={() => this.setState({ currentLayout: 'mobile' })}></button>
                                    <button type="button" className="btn btn-icon rfb_BtnLayoutDesktop" onClick={() => this.setState({ currentLayout: 'desktop' })}></button>
                                </div>
                            </div>
                        </div>
                        <div className="rfb_BodyContent">
                            <button type="button" className="btn btn-primary rfb_BtnAddNewField" onClick={this.addNewFieldPopup}>Add New Field</button>
                            <div className="rfb_FormLayout">
                                {fields.length > 0 &&
                                    <div className={"rfb_CurrentLayout " + currentLayout}>
                                        <div className="layoutLabel">Current layout is {currentLayout}</div>
                                        <div className="row">
                                            {
                                                fields.map((field, k) =>
                                                    <div key={k} data-colnumber={k}
                                                        draggable={true}
                                                        onDragStart={(e) => this.dragStart(e)}
                                                        onDragEnd={(e) => this.dragEnd(e)}
                                                        onDragEnter={(e) => this.dragEnter(e)}
                                                        onDragLeave={(e) => this.dragLeave(e)}
                                                        className={"draggable " + (dragging ? 'dragging ' : '') + (currentLayout === 'desktop'
                                                            ? field['data-class-lg'].replace('col-lg', 'c')
                                                            : field['data-class-sm'].replace('col-md', 'c')
                                                        )}>
                                                        {field.containerClass && delete field.containerClass}
                                                        {
                                                            (field['data-function'] === 'select')
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
                                                        <div className="optionPanel">
                                                            <span title="Width" className="optionIcon width" onClick={() => this.changeWidth(field)}></span>
                                                            {/* <span title="Edit" className="optionIcon edit"></span> */}
                                                            <span title="Delete" className="optionIcon delete" onClick={
                                                                () => this.deleteField(k)
                                                            }>
                                                                <i className={"trashLid" + (deleteId === k ? ' open' : '')}></i>
                                                                <i className="trashBin"></i>
                                                            </span>
                                                        </div>
                                                    </div>)
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="rfb_FormFooter">
                        <button type="button" className="btn btn-gray" onClick={() => this.submitForm(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddUpdateForm;