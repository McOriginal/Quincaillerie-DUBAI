import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';

import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';

import { deleteButton } from '../components/AlerteModal';
import defaultImg from './../../assets/images/medicament.jpg';
import { useNavigate } from 'react-router-dom';
import ProduitForm from './ProduitForm';
import { useAllProduit, useDeleteProduit } from '../../Api/queriesProduits';

export default function ProduitListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: produits, isLoading, error } = useAllProduit();
  const { mutate: deleteProduit } = useDeleteProduit();
  const [produitToUpdate, setProduitToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Ajouter un Produit');

  // Recherche State
  const [searchTerm, setSearchTerm] = useState('');

  // Fontion pour Rechercher
  const filterSearchProduits = produits?.filter((prod) => {
    const search = searchTerm.toLowerCase();

    return (
      prod.name.toString().toLowerCase().includes(search) ||
      prod.price.toString().includes(search) ||
      prod.stock.toString().includes(search)
    );
  });

  // Utilisation de useNavigate pour la navigation
  const navigate = useNavigate();
  // Function to handle deletion of a medicament
  function navigateToMedicamentApprovisonnement(id) {
    navigate(`/approvisonnement/${id}`);
  }

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Produits' breadcrumbItem='Liste de Produits' />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <ProduitForm
                produitToEdit={produitToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------------- */}

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='produitsList'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='info'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setProduitToUpdate(null);
                              tog_form_modal();
                            }}
                          >
                            <i className='fas fa-capsules align-center me-1'></i>{' '}
                            Ajouter un Produit
                          </Button>
                        </div>
                      </Col>
                      <Col className='col-sm'>
                        <div className='d-flex justify-content-sm-end'>
                          <div className='search-box me-4'>
                            <input
                              type='text'
                              className='form-control search border border-dark rounded'
                              placeholder='Rechercher...'
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            {isLoading && <LoadingSpiner />}
            {error && (
              <div className='text-danger text-center'>
                Erreur lors de chargement des données
              </div>
            )}
            {!error && !isLoading && filterSearchProduits?.length === 0 && (
              <div className='text-center'>Aucun Produit trouvés</div>
            )}
            {!error &&
              !isLoading &&
              filterSearchProduits?.length > 0 &&
              filterSearchProduits?.map((prod) => (
                <Col sm={6} lg={4} key={prod._id}>
                  <Card
                    style={{
                      boxShadow: '0px 0px 10px rgba(121,3,105,0.5)',
                      borderRadius: '15px',
                      height: '120px',
                      padding: '10px 20px',
                      display: 'flex',
                      gap: '20px',
                      flexDirection: 'row',
                      flexWrap: 'nowrap',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '5%',
                        right: '5%',
                      }}
                    >
                      <UncontrolledDropdown className='dropdown d-inline-block'>
                        <DropdownToggle
                          className='btn btn-soft-secondary btn-sm'
                          tag='button'
                        >
                          <i className='bx bx-caret-down-square fs-2 text-info'></i>
                        </DropdownToggle>
                        <DropdownMenu className='dropdown-menu-end'>
                          <DropdownItem
                            className='edit-item-btn'
                            onClick={() => {
                              setFormModalTitle('Modifier les données');
                              setProduitToUpdate(prod);
                              tog_form_modal();
                            }}
                          >
                            <i className='ri-pencil-fill align-bottom me-2 text-muted'></i>
                            Modifier
                          </DropdownItem>
                          <DropdownItem
                            className='edit-item-btn'
                            onClick={() => {
                              navigateToMedicamentApprovisonnement(prod._id);
                            }}
                          >
                            <i className=' bx bx-analyse align-center me-2 text-muted'></i>
                            Approvisonnée
                          </DropdownItem>
                          <DropdownItem
                            className='remove-item-btn'
                            onClick={() => {
                              deleteButton(prod._id, prod.name, deleteProduit);
                            }}
                          >
                            {' '}
                            <i className='ri-delete-bin-fill align-bottom me-2 text-muted'></i>{' '}
                            Delete{' '}
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <img
                      className='img-fluid'
                      style={{
                        borderRadius: '15px 15px 0 0',
                        height: '100%',
                        width: '30%',
                        objectFit: 'contain',
                      }}
                      src={prod.imageUrl ? prod.imageUrl : defaultImg}
                      alt={prod.name}
                    />

                    <CardBody>
                      <CardTitle className='fs-6'>
                        Nom:
                        <span style={{ color: 'gray' }}>
                          {' '}
                          {capitalizeWords(prod.name)}
                        </span>{' '}
                      </CardTitle>

                      <CardTitle>
                        {' '}
                        Prix:{' '}
                        <span style={{ color: 'gray' }}>
                          {' '}
                          {formatPrice(prod.price)} F
                        </span>{' '}
                      </CardTitle>
                    </CardBody>
                  </Card>
                </Col>
              ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
