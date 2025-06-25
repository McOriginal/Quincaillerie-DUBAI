import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import LoadingSpiner from '../components/LoadingSpiner';
import { useAllFournisseur } from '../../Api/queriesFournisseur';
import {
  capitalizeWords,
  formatPhoneNumber,
} from '../components/capitalizeFunction';
import {
  useCreateApprovisonnement,
  useUpdateApprovisonnement,
} from '../../Api/queriesApprovisonnement';

const ApprovisonnementForm = ({ approvisonnementToEdit, tog_form_modal }) => {
  // Matériels Query pour créer la Medicament
  const { mutate: createApprovisonement } = useCreateApprovisonnement();
  const { mutate: updateApprovisonnement } = useUpdateApprovisonnement();

  const {
    data: fournisseurData,
    isLoading: fourniLoading,
    error: fourniError,
  } = useAllFournisseur();
  const [isLoading, setIsLoading] = useState(false);

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      produit: approvisonnementToEdit?.produit || '',
      quantity: approvisonnementToEdit?.quantity || undefined,
      price: approvisonnementToEdit?.price || undefined,
      deliveryDate: approvisonnementToEdit?.deliveryDate.substring(0, 10) || '',
      fournisseur: approvisonnementToEdit?.fournisseur?._id || '',
    },

    validationSchema: Yup.object({
      produit: Yup.string().required('Ce champ est obligatoire'),
      quantity: Yup.number().required('Ce champ est obligatoire'),
      price: Yup.number().required('Ce champ est obligatoire'),
      deliveryDate: Yup.date().required('Ce champ est obligatoire'),
      fournisseur: Yup.string().required('Ce champ est obligatoire'),
    }),

    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);

      const approvisonnementDataLoaded = {
        ...values,
      };

      if (approvisonnementToEdit) {
        updateApprovisonnement(
          { id: approvisonnementToEdit._id, data: approvisonnementDataLoaded },
          {
            onSuccess: () => {
              setIsLoading(false);
              successMessageAlert('Mise à jour avec succès');
              tog_form_modal();
            },
            onError: (err) => {
              const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                'Oh Oh ! Une erreur est survenue lors de mise à jour';
              errorMessageAlert(errorMessage);
              setIsLoading(false);
            },
          }
        );
      } else {
        createApprovisonement(values, {
          onSuccess: () => {
            successMessageAlert('Approvisionné avec succès');
            setIsLoading(false);
            resetForm();
            tog_form_modal();
          },
          onError: (err) => {
            const errorMessage =
              err?.response?.data?.message ||
              err?.message ||
              "Oh Oh ! Une erreur est survenue lors de l'enregistrement";
            errorMessageAlert(errorMessage);
            setIsLoading(false);
          },
        });
      }
      // Sécurité : timeout pour stopper le chargement si blocage
      setTimeout(() => {
        if (isLoading) {
          errorMessageAlert('Une erreur est survenue. Veuillez réessayer !');
          setIsLoading(false);
        }
      }, 10000);
    },
  });

  return (
    <Form
      className='needs-validation'
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      <Row>
        <Col md='12'>
          <FormGroup>
            <Label htmlFor='produit'>Marchandise</Label>
            <Input
              id='produit'
              type='text'
              name='produit'
              placeholder='Nom de marchandise'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.produit || ''}
              invalid={
                validation.touched.produit && validation.errors.produit
                  ? true
                  : false
              }
            />

            {validation.touched.produit && validation.errors.produit ? (
              <FormFeedback type='invalid'>
                {validation.errors.produit}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='price'>Prix d'Achat</Label>
            <Input
              name='price'
              placeholder='Entrez un prix'
              type='number'
              className='form-control'
              id='price'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.price || ''}
              invalid={
                validation.touched.price && validation.errors.price
                  ? true
                  : false
              }
            />
            {validation.touched.price && validation.errors.price ? (
              <FormFeedback type='invalid'>
                {validation.errors.price}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='quantity'>Quantité</Label>
            <Input
              name='quantity'
              placeholder='ex 10; 40; 0'
              type='number'
              className='form-control'
              id='quantity'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.quantity || ''}
              invalid={
                validation.touched.quantity && validation.errors.quantity
                  ? true
                  : false
              }
            />
            {validation.touched.quantity && validation.errors.quantity ? (
              <FormFeedback type='invalid'>
                {validation.errors.quantity}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='deliveryDate'>Date d'Arrivée</Label>
            <Input
              name='deliveryDate'
              placeholder='Chambre dédié pour les opérations chirugical.....'
              type='date'
              className='form-control'
              id='deliveryDate'
              max={new Date().toISOString().split('T')[0]} // Limite à aujourd'hui
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.deliveryDate || ''}
              invalid={
                validation.touched.deliveryDate &&
                validation.errors.deliveryDate
                  ? true
                  : false
              }
            />
            {validation.touched.deliveryDate &&
            validation.errors.deliveryDate ? (
              <FormFeedback type='invalid'>
                {validation.errors.deliveryDate}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='12'>
          <FormGroup>
            <Label htmlFor='fournisseur'>Fournisseur</Label>
            <Input
              type='select'
              name='fournisseur'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.fournisseur || ''}
              invalid={
                validation.touched.fournisseur && validation.errors.fournisseur
                  ? true
                  : false
              }
            >
              {fourniLoading && <LoadingSpiner />}
              {fourniError && (
                <div className='fw-bold text-danger text-center'></div>
              )}
              <option value=''>Sélectionner un fournisseur</option>
              {!fourniError &&
                !fourniLoading &&
                fournisseurData?.length > 0 &&
                fournisseurData.map((four) => (
                  <option key={four._id} value={four._id}>
                    {capitalizeWords(four.firstName)}{' '}
                    {capitalizeWords(four.lastName)}{' '}
                    {formatPhoneNumber(four.phoneNumber)}
                  </option>
                ))}
            </Input>
            {validation.touched.fournisseur && validation.errors.fournisseur ? (
              <FormFeedback type='invalid'>
                {validation.errors.fournisseur}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>

      <div className='d-grid text-center mt-4'>
        {isLoading && <LoadingSpiner />}
        {!isLoading && (
          <Button color='success' type='submit'>
            Enregisrer
          </Button>
        )}
      </div>
    </Form>
  );
};

export default ApprovisonnementForm;
