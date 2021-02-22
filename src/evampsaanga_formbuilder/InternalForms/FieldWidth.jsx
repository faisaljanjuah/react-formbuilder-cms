import React from 'react';
import * as Yup from 'yup';
import RFB_InternalForm from './Form';

class FieldWidth extends RFB_InternalForm {
    map = {
        1: '8.33%',
        2: '16.66%',
        3: '25%',
        4: '33.33%',
        5: '41.66%',
        6: '50%',
        7: '58.33%',
        8: '66.66%',
        9: '75%',
        10: '83.33%',
        11: '91.66%',
        12: '100%',
    }

    state = {
        errors: {},
        formData: {
            sm: 12,
            lg: 4
        },
        desc: {
            sm: 'Will be 100% of its row',
            lg: 'will be 33.33% of its row'
        }
    }

    componentDidMount() {
        let sm = this.props.getField['data-class-sm'].replace('col-md-', '');
        let lg = this.props.getField['data-class-lg'].replace('col-lg-', '');
        let { formData } = { ...this.state };
        formData.sm = sm;
        formData.lg = lg;
        this.setState({ formData }, () => {
            this.updateDescription('sm', sm);
            this.updateDescription('lg', lg);
        });
    }

    schema = Yup.object().shape({
        sm: Yup.string().required('Please choose width for mobile devices'),
        lg: Yup.string().required('Please choose width for desktop devices'),
    });

    changeDescription = ({ currentTarget: field }) => {
        this.updateDescription(field.name, field.value);
    }

    updateDescription = (name, value) => {
        let { desc } = { ...this.state };
        desc[name] = 'Will be ' + this.map[value] + ' of its row';
        this.setState({ desc });
    }

    submitForm = () => {
        let details = { ...this.state.formData };
        details.id = this.props.getField['data-id'];
        this.props.updateWidth(details);
        this.props.showWidthPopup(false);
    }

    render() {
        const { sm, lg } = this.state.formData;
        const { desc } = this.state;

        let ar = [...Array(12)].map((v, k) => ({ text: v = k + 1 }));

        let widthForm = {
            sm: { label: 'Width for small devices', value: sm, options: ar, description: desc.sm, onChange: (e) => this.changeDescription(e), firstOption: { render: false } },
            lg: { label: 'Width for large devices', value: lg, options: ar, description: desc.lg, onChange: (e) => this.changeDescription(e), firstOption: { render: false } },
            submitBtn: { label: 'Save', type: 'submit', className: 'btn btn-primary' }
        }

        return (
            <React.Fragment>
                <h2>Change width for field</h2>
                <div className="rfb_changeFieldWidthWrapper">
                    <form onSubmit={this.ValidateAndSubmit}>
                        {this.insertSelect({ sm: widthForm.sm })}
                        {this.insertSelect({ lg: widthForm.lg })}

                        {this.insertButton({ submitBtn: widthForm.submitBtn })}
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default FieldWidth;