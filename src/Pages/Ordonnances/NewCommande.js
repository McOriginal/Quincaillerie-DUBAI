import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import LoadingSpiner from '../components/LoadingSpiner';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import imgMedicament from './../../assets/images/medicament.jpg';
import { useNavigate } from 'react-router-dom';
import { useAllProduit } from '../../Api/queriesProduits';
import { useCreateCommande } from '../../Api/queriesCommande';

export default function NewCommande() {
  // State de navigation
  const navigate = useNavigate();

  // Query pour afficher les Médicament
  const { data: produitsData, isLoading, error } = useAllProduit();

  // Query pour ajouter une COMMANDE dans la base de données
  const { mutate: createCommande } = useCreateCommande();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Ajoute des produits dans le panier sans besoins de la base de données
  const [cartItems, setCartsItems] = useState([]);

  //  Fonction pour ajouter les produit dans base de données
  const addToCart = (produit) => {
    setCartsItems((prevCart) => {
      // On vérifie si le produit n'existe pas déjà
      const existingItem = prevCart.find(
        (item) => item.produit._id === produit._id
      );

      //  Si le produit existe on incrémente la quantité
      if (existingItem) {
        return prevCart.map((item) =>
          item.produit._id === produit._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      //  Sinon on ajoute le produit avec la quantité (1)
      return [...prevCart, { produit, quantity: 1 }];
    });
  };

  // Fonction pour Diminuer la quantité dans le panier
  // Si la quantité est 1 alors on le supprime
  const decreaseQuantity = (produitId) => {
    setCartsItems((prevCart) =>
      prevCart
        .map((item) =>
          item.produit._id === produitId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Fonction pour augmenter la quantité dans le panier
  const increaseQuantity = (produitId) => {
    setCartsItems((prevCart) =>
      prevCart.map((item) =>
        item.produit._id === produitId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Fonction pour vider les produits dans le panier
  const clearCart = () => {
    setCartsItems([]);
  };

  // Fonction pour calculer le total des élements dans le panier
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.produit.price * item.quantity,
    0
  );

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      fullName: '',
      phoneNumber: undefined,
      adresse: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Veillez Entrez une valeur correct !')
        .required('Ce champ est obligatoire'),

      phoneNumber: Yup.number().required('Ce champ est obligatoire'),
      adresse: Yup.string()
        .matches(/^[a-z0-9À-ÿ\s]+$/i, 'Veillez Entrez une valeur correct !')
        .required('Ce champ est obligatoire'),
    }),

    onSubmit: (values, { resetForm }) => {
      setIsSubmitting(false);

      // Vérification de quantité dans le STOCK
      if (cartItems.length === 0) return;

      setIsSubmitting(true);
      const payload = {
        // Les informations du clients
        fullName: values.fullName,
        adresse: values.adresse,
        phoneNumber: values.phoneNumber,
        // ------------------------
        // Les ARTICLES de panier
        items: cartItems.map((item) => ({
          produit: item.produit._id,
          quantity: item.quantity,
        })),
        totalAmount,
      };

      // On passe au CREATION de COMMANDE dans la table
      createCommande(payload, {
        onSuccess: () => {
          // Après on vide le panier
          clearCart();
          successMessageAlert(
            capitalizeWords('Commande Enregistrée avec succès !')
          );
          setIsSubmitting(false);
          resetForm();
          navigate('/paiements');
        },
        onError: (err) => {
          const message =
            err?.response?.data?.message ||
            err.message ||
            "Erreur lors de l'Enregistrement !";
          errorMessageAlert(message);
          setIsSubmitting(false);
        },
      });
    },
  });
  // Validation de commande et AJOUTE DANS LA BASE DE DONNEES
  // const handleSubmitOrder = () => {

  //   // Vérification de quantité dans le STOCK
  //   if (cartItems.length === 0) return;

  //   setIsSubmitting(true);
  //   const payload = {
  //     items: cartItems.map((item) => ({
  //       produit: item.produit._id,
  //       quantity: item.quantity,
  //     })),
  //     totalAmount,
  //   };

  //   createCommande(payload, {
  //     onSuccess: () => {
  //       // Après on vide le panier
  //       clearCart();
  //       successMessageAlert('produit validée avec succès !');
  //       setIsSubmitting(false);
  //       navigate('/produits');
  //     },
  //     onError: (err) => {
  //       const message =
  //         err || err.message || "Erreur lors de la validation de l'produit.";
  //       errorMessageAlert(message);
  //       setIsSubmitting(false);
  //     },
  //   });
  // };

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Commandes' breadcrumbItem='Nouvelle Commande' />

          <Row>
            {/* Panier */}
            <Col sm={6}>
              <Card>
                <CardBody style={{ height: '280px', overflowY: 'scroll' }}>
                  <CardTitle className='mb-4'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <h4>Panier</h4>
                      <h5 className='text-warning'>
                        Total : {formatPrice(totalAmount)} F
                      </h5>
                    </div>
                  </CardTitle>
                  {/* Bouton */}
                  <hr />
                  {isSubmitting && <LoadingSpiner />}

                  {cartItems.length > 0 && !isSubmitting && (
                    <div className='d-flex gap-4 mt-3'>
                      <Button
                        color='warning'
                        className='fw-bold font-size-11'
                        onClick={clearCart}
                      >
                        Vider le Panier
                      </Button>

                      <div className='d-grid' style={{ width: '100%' }}>
                        <Button
                          color='primary'
                          className='fw-bold'
                          onClick={() => validation.handleSubmit()}
                        >
                          Valide
                        </Button>
                      </div>
                    </div>
                  )}
                  <hr />
                  {/* Bouton */}

                  {cartItems.length === 0 && (
                    <p className='text-center'>
                      Veuillez cliquez sur un produit pour l'ajouter dans le
                      panier
                    </p>
                  )}
                  {cartItems.map((item) => (
                    <div
                      key={item.produit._id}
                      className='d-flex justify-content-between align-items-center mb-2 border-bottom border-black p-2 shadow shadow-md'
                    >
                      <div>
                        <strong>{capitalizeWords(item.produit.name)}</strong>
                        <div>
                          {item.quantity} × {formatPrice(item.produit.price)} F
                          = {formatPrice(item.produit.price * item.quantity)} F
                        </div>
                      </div>
                      <div className='d-flex align-items-center gap-2'>
                        <Button
                          color='danger'
                          size='sm'
                          onClick={() => decreaseQuantity(item.produit._id)}
                        >
                          -
                        </Button>

                        <input
                          type='number'
                          min={1}
                          value={item.quantity}
                          onClick={(e) => e.stopPropagation()} // Évite le clic sur la carte
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value) && value > 0) {
                              setCartsItems((prevCart) =>
                                prevCart.map((i) =>
                                  i.produit._id === item.produit._id
                                    ? { ...i, quantity: value }
                                    : i
                                )
                              );
                            }
                          }}
                          style={{
                            width: '60px',
                            textAlign: 'center',
                            border: '1px solid orange',
                            borderRadius: '5px',
                          }}
                        />

                        <Button
                          color='success'
                          size='sm'
                          onClick={() => increaseQuantity(item.produit._id)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Col>

            {/* Les information sur Client */}
            <Col sm='6'>
              <Card>
                <CardBody>
                  <Form
                    className='needs-validation'
                    onSubmit={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                  >
                    <Col sm='12'>
                      <FormGroup>
                        <Label for='fullName'>Nom et Prénom</Label>
                        <Input
                          id='fullName'
                          type='text'
                          className='form form-control'
                          placeholder='Nom et Prénom de Client'
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.fullName || ''}
                          invalid={
                            validation.touched.fullName &&
                            validation.errors.fullName
                              ? true
                              : false
                          }
                        />
                        {validation.touched.fullName &&
                        validation.errors.fullName ? (
                          <FormFeedback type='invalid'>
                            {validation.errors.fullName}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col sm='12'>
                      <FormGroup>
                        <Label for='fullName'>Téléphone</Label>
                        <Input
                          id='phoneNumber'
                          type='number'
                          min={0}
                          className='form form-control'
                          placeholder='N°Téléphone de Client'
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.phoneNumber || ''}
                          invalid={
                            validation.touched.phoneNumber &&
                            validation.errors.phoneNumber
                              ? true
                              : false
                          }
                        />
                        {validation.touched.phoneNumber &&
                        validation.errors.phoneNumber ? (
                          <FormFeedback type='invalid'>
                            {validation.errors.phoneNumber}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col sm='12'>
                      <FormGroup>
                        <Label for='fullName'>Adresse Domicile</Label>
                        <Input
                          id='adresse'
                          type='text'
                          className='form form-control'
                          placeholder="Entrez l'adresse de livraison"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.adresse || ''}
                          invalid={
                            validation.touched.adresse &&
                            validation.errors.adresse
                              ? true
                              : false
                          }
                        />
                        {validation.touched.adresse &&
                        validation.errors.adresse ? (
                          <FormFeedback type='invalid'>
                            {validation.errors.adresse}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            {/* ------------------------------------------------------------- */}
            {/* ------------------------------------------------------------- */}
            {/* ------------------------------------------------------------- */}
            {/* Liste des produits */}
            <Col md={12}>
              <Card>
                <CardBody>
                  {isLoading && <LoadingSpiner />}
                  {error && (
                    <div className='text-danger text-center'>
                      Une erreur est survenue ! Veuillez actualiser la page.
                    </div>
                  )}
                  <Row>
                    {!error &&
                      produitsData?.length > 0 &&
                      produitsData?.map((produit) => (
                        <Col md={3} sm={6} key={produit._id}>
                          <Card
                            className='shadow shadow-lg'
                            onClick={() => addToCart(produit)}
                            style={{ cursor: 'pointer' }}
                          >
                            <CardImg
                              style={{
                                height: '100px',
                                objectFit: 'contain',
                              }}
                              src={
                                produit.imageUrl
                                  ? produit.imageUrl
                                  : imgMedicament
                              }
                              alt={produit.name}
                            />
                            <CardBody>
                              <CardText className='text-center'>
                                {capitalizeWords(produit.name)}
                              </CardText>
                              <CardText className='text-center fw-bold'>
                                Stock:{' '}
                                {produit.stock >= 10 ? (
                                  <span className='text-primary'>
                                    {' '}
                                    {produit.stock}{' '}
                                  </span>
                                ) : (
                                  <span className='text-danger'>
                                    {' '}
                                    {produit.stock}{' '}
                                  </span>
                                )}
                              </CardText>
                              <CardText className='text-center fw-bold'>
                                {formatPrice(produit.price)} F
                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
