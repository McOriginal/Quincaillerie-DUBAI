import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { Link } from 'react-router-dom';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import {
  useAllApprovisonnement,
  useDeleteApprovisonnement,
} from '../../Api/queriesApprovisonnement';
import FormModal from '../components/FormModal';
import ApprovisonnementForm from './ApprovisonnementForm';

export default function ApprovisonnementListe() {
  const {
    data: approvisonnementData,
    isLoading,
    error,
  } = useAllApprovisonnement();
  const { mutate: deleteApprovisonnement, isDeleting } =
    useDeleteApprovisonnement();

  const [approvisonnementToUpdate, setApprovisonnementToUpdate] =
    useState(null);
  const [form_modal, setForm_modal] = useState(false);
  const [formModalTitle, setFormModalTitle] = useState(
    'Faire une Approvisonnement'
  );

  // Ouverture de Modal Form
  function tog_form_modal() {
    setForm_modal(!form_modal);
  }

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour la recherche
  const filterSearchApprovisonnement = approvisonnementData?.filter((appro) => {
    const search = searchTerm.toLowerCase();

    return (
      `${appro?.fournisseur?.firstName} ${appro?.fournisseur?.lasttName}`
        .toLowerCase()
        .includes(search) ||
      (appro?.fournisseur?.phoneNumber || '').toString().includes(search) ||
      appro?.fournisseur?.adresse.toLowerCase().includes(search) ||
      appro?.produit.toLowerCase().includes(search) ||
      appro?.quantity.toString().includes(search) ||
      appro?.price.toString().includes(search) ||
      new Date(appro?.delivryDate)
        .toLocaleDateString('fr-Fr')
        .toString()
        .includes(search)
    );
  });

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Produits' breadcrumbItem='Approvisonnement' />
          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <ApprovisonnementForm
                approvisonnementToEdit={approvisonnementToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Row className='g-4 mb-3'>
                    <Col className='col-sm-auto'>
                      <div className='d-flex gap-1'>
                        <Button
                          color='info'
                          className='add-btn'
                          id='create-btn'
                          onClick={() => {
                            setApprovisonnementToUpdate(null);
                            tog_form_modal();
                          }}
                        >
                          <i className='fas fa-redo-alt align-center me-1'></i>{' '}
                          Ajouter une Approvisonnement
                        </Button>
                      </div>
                    </Col>
                    <Col className='col-sm'>
                      <div className='d-flex justify-content-sm-end'>
                        <div className='search-box me-4'>
                          <input
                            type='text'
                            className='form-control search border border-black rounded'
                            placeholder='Rechercher...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div id='approvisonnementList'>
                    {error && (
                      <div className='text-danger text-center'>
                        Erreur de chargement des données
                      </div>
                    )}
                    {isLoading && <LoadingSpiner />}

                    <div className='table-responsive table-card mt-3 mb-1'>
                      {!filterSearchApprovisonnement?.length &&
                        !isLoading &&
                        !error && (
                          <div className='text-center text-mutate'>
                            Aucune approvisonnement pour le moment !
                          </div>
                        )}
                      {!error &&
                        filterSearchApprovisonnement?.length > 0 &&
                        !isLoading && (
                          <table
                            className='table align-middle table-nowrap table-hover'
                            id='approvisonnementTable'
                          >
                            <thead className='table-light'>
                              <tr>
                                <th scope='col' style={{ width: '50px' }}>
                                  ID
                                </th>
                                <th data-sort='marchandise'>Produit</th>
                                <th data-sort='marchandise'>
                                  Quantité arrivée
                                </th>
                                <th data-sort='price'>Prix d'achat</th>
                                <th data-sort='deliveryDate'>Date d'arrivée</th>
                                <th data-sort='fournisseur_name'>
                                  Fournisseur
                                </th>

                                <th data-sort='phone'>Téléphone</th>

                                <th data-sort='action'>Action</th>
                              </tr>
                            </thead>

                            <tbody className='list form-check-all text-center'>
                              {filterSearchApprovisonnement?.map(
                                (appro, index) => (
                                  <tr key={appro._id}>
                                    <th scope='row'>{index + 1}</th>
                                    <td>{capitalizeWords(appro.produit)}</td>

                                    <td>{formatPrice(appro.quantity)}</td>
                                    <td>
                                      {formatPrice(appro.price)}
                                      {' F '}
                                    </td>

                                    <td>
                                      {new Date(
                                        appro.deliveryDate
                                      ).toLocaleDateString('fr-Fr', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        weekday: 'short',
                                      })}
                                    </td>
                                    <td>
                                      {capitalizeWords(
                                        appro.fournisseur['firstName']
                                      )}{' '}
                                      {capitalizeWords(
                                        appro.fournisseur['lastName']
                                      )}{' '}
                                    </td>

                                    <td>
                                      {formatPhoneNumber(
                                        appro.fournisseur['phoneNumber']
                                      )}
                                    </td>

                                    <td>
                                      <div className='d-flex gap-2'>
                                        <div className='edit'>
                                          <button
                                            className='btn btn-sm btn-success edit-item-btn'
                                            data-bs-toggle='modal'
                                            data-bs-target='#showModal'
                                            onClick={() => {
                                              setFormModalTitle(
                                                'Modifier les données'
                                              );
                                              setApprovisonnementToUpdate(
                                                appro
                                              );
                                              tog_form_modal();
                                            }}
                                          >
                                            <i className='ri-pencil-fill text-white'></i>
                                          </button>
                                        </div>
                                        {isDeleting && <LoadingSpiner />}
                                        {!isDeleting && (
                                          <div className='remove'>
                                            <button
                                              className='btn btn-sm btn-danger remove-item-btn'
                                              data-bs-toggle='modal'
                                              data-bs-target='#deleteRecordModal'
                                              onClick={() => {
                                                deleteButton(
                                                  appro._id,
                                                  appro.produit,
                                                  deleteApprovisonnement
                                                );
                                              }}
                                            >
                                              <i className='ri-delete-bin-fill text-white'></i>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        )}
                    </div>

                    <div className='d-flex justify-content-end'>
                      <div className='pagination-wrap hstack gap-2'>
                        <Link
                          className='page-item pagination-prev disabled'
                          to='#'
                        >
                          Previous
                        </Link>
                        <ul className='pagination listjs-pagination mb-0'></ul>
                        <Link className='page-item pagination-next' to='#'>
                          Next
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
