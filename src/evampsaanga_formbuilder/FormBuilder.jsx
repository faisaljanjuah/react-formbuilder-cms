import React, { Component } from 'react';
import formCollection from './formCollection.json';
import AddUpdateForm from './addUpdateForm';
import { setLocalStorage } from './../evampsaanga_jsFiles/localStorage';

class ReactFormBuilder extends Component {
    formName = 'react-json-forms';
    state = {
        message: '',
        newForm: false,
        selectedForms: [],
        addUpdateScreen: false,
        confirmForDelete: false,
        currentForm: {},
        collection: formCollection ? (formCollection[this.formName] ? formCollection[this.formName] : '') : ''
    }
    importCollection = (e) => {
        let errorMsg = '';
        this.setState({ message: errorMsg });
        let files = e.currentTarget.files;
        if (!files.length || !window.FileReader) {
            errorMsg = 'No file selected!';
            this.setState({ message: errorMsg });
            console.log(errorMsg);
            return;
        }
        if (files[0].type.indexOf("application/json") > -1) {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = () => {
                let collection = reader.result.split(';base64,')[1];
                try {
                    collection = JSON.parse(atob(collection));
                    if (collection && collection[this.formName] !== undefined) {
                        collection = collection[this.formName];
                        this.setState({ collection });
                    }
                    else {
                        errorMsg = 'Not a valid JSON for react-form-builder!';
                        this.setState({ message: errorMsg });
                        throw (Error(errorMsg));
                    }
                } catch (er) {
                    console.log(er.message);
                }
            }
        }
        else {
            errorMsg = 'Invalid JSON file, Please choose only valid JSON for react-form-builder!';
            this.setState({ message: errorMsg });
            console.log(errorMsg);
        }
        e.currentTarget.value = ''; // reset Input field
    }
    exportForms = () => {
        const aTag = document.createElement("a");
        const data = `{"${this.formName}": ${JSON.stringify(this.state.collection)} }`;
        const file = new Blob([data], { type: 'application/json' });
        aTag.href = URL.createObjectURL(file);
        aTag.id = this.formName;
        aTag.download = this.formName + ".json";
        aTag.style = "display: none;"; // optional statement for creating hidden element in HTML
        document.body.appendChild(aTag); // Required for this to work in FireFox
        aTag.click();
        const rTag = document.getElementById(this.formName);
        rTag.remove();
    }
    addUpdateForm = (e, form) => {
        e.preventDefault();
        let { newForm } = { ...this.state };
        newForm = false;
        if (form === undefined) {
            form = {};
            form.id = 1;
            form.name = '';
            form.apiEndpoint = '';
            this.state.collection.map(i => i.id >= form.id ? form.id = i.id + 1 : null)
            newForm = true;
        }
        this.setState({ currentForm: form, addUpdateScreen: true, newForm });
    }
    updateCollection = (e) => {
        if (e !== undefined) {
            let { currentForm, collection } = { ...this.state };
            currentForm = {};
            const i = collection.findIndex(f => f.id === e.id);
            (i < 0) ? collection = [...collection, e] : collection[i] = e;
            this.setState({ currentForm, collection });
        }
    }
    updateSelection = (e, id) => {
        let { selectedForms, collection } = { ...this.state };
        if (id === undefined) e.currentTarget.checked ? selectedForms = collection.map(c => c.id) : selectedForms = [];
        else {
            const i = selectedForms.findIndex(i => i === id);
            (i < 0) ? selectedForms.push(id) : selectedForms = selectedForms.filter(c => c !== id);
        }
        this.setState({ selectedForms });
    }
    deleteForms = () => {
        let { confirmForDelete, selectedForms, collection } = { ...this.state };
        collection = collection.filter(f => selectedForms.indexOf(f.id) < 0);
        confirmForDelete = false;
        this.setState({ confirmForDelete, collection, selectedForms: [] });
    }
    saveIntoStorage = () => {
        alert('Form Saved');
        // console.log(this.state.collection);
        setLocalStorage('formcollection', this.state.collection);
    }
    render() {
        const { addUpdateScreen, collection, currentForm, selectedForms, newForm, confirmForDelete } = this.state;
        return (
            <div className="ReactFormBuilder">
                {
                    confirmForDelete && <div className="rfb_PopupOverlay d-flex align-items-center justify-content-center">
                        <div className="rfb_PopupContainer rfb_AddNewFieldPopup">
                            <span className="rfb_ClosePopup" onClick={() => this.setState({ confirmForDelete: false })}>&#10005;</span>
                            <h2>Confirm Delete</h2>
                            <p>Are you sure you want to delete selected forms?</p>
                            <div className="d-flex justify-content-center mt-30">
                                <button onClick={() => this.setState({ confirmForDelete: false })} className="btn btn-wide btn-primary">No</button>
                                <button onClick={this.deleteForms} className="btn btn-wide btn-danger">Yes</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    addUpdateScreen
                        ? <AddUpdateForm form={currentForm} newForm={newForm} editMode={e => this.setState({ addUpdateScreen: e })} getChanges={this.updateCollection} formNames={collection.map(f => f.name)} />
                        : <div className="rfb_MainPageWrapper">
                            <div className="d-flex justify-content-between rfb-TopBtns">
                                <div className="d-flex rfb_ImportExportBtns">
                                    <div className="rfb_ImportCollectionButton">
                                        <input type="file" id="importFormCollection" accept=".json" onChange={this.importCollection} />
                                        <label htmlFor="importFormCollection" className="btn btn-primary">Import Forms</label>
                                    </div>
                                    {collection.length > 0 && <button className="btn btn-primary rfb_BtnExportForms" onClick={this.exportForms}>Export All Forms</button>}
                                    {selectedForms.length > 0 && <button className="btn btn-danger rfb_BtnDeleteForms" onClick={() => this.setState({ confirmForDelete: true })}>Delete Forms</button>}
                                    <button className="btn btn-primary" onClick={this.saveIntoStorage}>Save Into App</button>
                                </div>
                                <button className="btn btn-primary rfb_BtnCreateNewForm" onClick={(e) => this.addUpdateForm(e)}>Create New Form</button>
                            </div>
                            <div className="rfb_ListContainer">
                                <div className="d-flex flex-column">
                                    {this.state.message && <div className="rfb_message rfb_error">{this.state.message}</div>}
                                    <div className="rfb_Forms">
                                        {
                                            collection.length > 0 &&
                                            <ul className="rfb_FormList">
                                                <li>
                                                    <span className="rfb_InputOption rfb_checkbox">
                                                        <input type="checkbox" id="cb_All"
                                                            onChange={(e) => this.updateSelection(e)}
                                                            checked={selectedForms.length === collection.length ? true : false}
                                                        />
                                                        <label htmlFor="cb_All"></label>
                                                    </span>
                                                    <span className="rfb_FormItem none">Select All</span>
                                                </li>
                                                {collection.map((f, k) => <li key={k}>
                                                    <span className="rfb_InputOption rfb_checkbox">
                                                        <input type="checkbox" id={"cb_" + f.id}
                                                            onChange={(e) => this.updateSelection(e, f.id)}
                                                            checked={selectedForms.indexOf(f.id) > -1 ? true : false} />
                                                        <label htmlFor={"cb_" + f.id}></label>
                                                    </span>
                                                    <span className="rfb_FormItem" onClick={(e) => this.addUpdateForm(e, f)}>{f.name}</span>
                                                </li>)}
                                            </ul>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default ReactFormBuilder;