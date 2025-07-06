import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from 'reactstrap';
import FormModal from '../../components/FormModal';
import LoadingSpiner from '../../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPrice,
} from '../../components/capitalizeFunction';
import { deleteButton } from '../../components/AlerteModal';
import {
  useAllLivraisonHistorique,
  useDeleteLivraisonHistorique,
} from '../../../Api/queriesLivraisonHistorique';
import LivraisonHistoriqueForm from './LivraisonHistoriqueForm';

export default function LivraisonHistorique({ id }) {
  const [form_modal, setForm_modal] = useState(false);
  // Récupération des Historiques de Livraison Historique
  const {
    data: livraisonHistoriqueData,
    isLoading,
    error,
  } = useAllLivraisonHistorique(id);

  // State pour supprimer le Paiement dans l'historique
  const { mutate: deleteLivraisonHistorique, isDeleting } =
    useDeleteLivraisonHistorique();

  const [livraisonToUpdate, setLivraisonToUpdate] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  // Ouverture de Modal Form
  function tog_form_modal() {
    setForm_modal(!form_modal);
  }

  // State de Recherche
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction de Rechercher
  const filterSearchLivraisonHistorique = livraisonHistoriqueData?.filter(
    (livraison) => {
      const search = searchTerm.toLowerCase();
      return (
        livraison?.produit.toLowerCase().includes(search) ||
        (livraison?.quantity || 0).toString().includes(search) ||
        new Date(livraison?.livraisonDate)
          .toLocaleDateString('fr-Fr')
          .includes(search)
      );
    }
  );

  // La Quantité des produits Filter dans la barre de recherche
  const filterQuantity = filterSearchLivraisonHistorique?.reduce(
    (acc, item) => (acc += item?.quantity),
    0
  );
  // ----------------------------------------

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formTitle}
            size='md'
            bodyContent={
              <LivraisonHistoriqueForm
                selectedLivraisonToUpdate={livraisonToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardTitle className='text-center mb-4 mt-2 font-size-20 '>
                  Produits Livrés
                </CardTitle>
                <CardBody>
                  <div id='Livraison HistoriqueList'>
                    <Row className='g-4 mb-3 justify-content-between align-items-center'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='info'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setLivraisonToUpdate(null);
                              setFormTitle('Ajouter une Livraison');
                              tog_form_modal();
                            }}
                          >
                            <i className='fas fa-dollar-sign align-center me-1'></i>{' '}
                            Ajouter une Livraison
                          </Button>
                        </div>
                      </Col>
                      <Col className='col-sm-auto'>
                        {searchTerm !== '' && (
                          <h6>
                            Quantié Livré:{' '}
                            <span className='text-warning'>
                              {formatPrice(filterQuantity)}
                            </span>{' '}
                          </h6>
                        )}
                      </Col>
                      <Col className='col-sm-auto'>
                        <div className='d-flex justify-content-sm-end gap-2'>
                          {searchTerm !== '' && (
                            <Button
                              color='danger'
                              onClick={() => setSearchTerm('')}
                            >
                              <i className='fas fa-window-close'></i>
                            </Button>
                          )}
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
                    {error && (
                      <div className='text-danger text-center'>
                        Erreur de chargement des données
                      </div>
                    )}
                    {isLoading && <LoadingSpiner />}

                    <div className='table-responsive table-card mt-3 mb-1'>
                      {filterSearchLivraisonHistorique?.length === 0 && (
                        <div className='text-center text-mutate'>
                          Aucune Livraison !
                        </div>
                      )}

                      {/* Liste Historique de Paiement si ça existe */}
                      {!error &&
                        !isLoading &&
                        filterSearchLivraisonHistorique?.length > 0 && (
                          <table
                            className='table align-middle  border-all border-2 border-secondary table-nowrap table-hover text-center'
                            id='paiementTable'
                          >
                            <thead className='table-light'>
                              <tr>
                                <th
                                  style={{ width: '50px' }}
                                  data-sort='paiementDate'
                                >
                                  Date de Livraison
                                </th>

                                <th
                                  className='text-center'
                                  data-sort='totaPayer'
                                >
                                  Produit
                                </th>

                                <th>Quantité Livré</th>
                                <th data-sort='action'>Action</th>
                              </tr>
                            </thead>

                            <tbody className='list form-check-all'>
                              {filterSearchLivraisonHistorique?.length > 0 &&
                                filterSearchLivraisonHistorique?.map(
                                  (livraison) => (
                                    <tr key={livraison?._id}>
                                      <th scope='row'>
                                        {new Date(
                                          livraison?.livraisonDate
                                        ).toLocaleDateString()}
                                      </th>

                                      <td>
                                        {capitalizeWords(livraison?.produit)}
                                      </td>

                                      <td>
                                        {formatPrice(livraison?.quantity)}
                                      </td>

                                      <td>
                                        {isDeleting && <LoadingSpiner />}
                                        {!isDeleting && (
                                          <div className='d-flex gap-2 justify-content-center alitgn-items-center'>
                                            <div>
                                              <button
                                                className='btn btn-sm btn-warning show-item-btn'
                                                data-bs-toggle='modal'
                                                data-bs-target='#showModal'
                                                onClick={() => {
                                                  setLivraisonToUpdate(
                                                    livraison
                                                  );
                                                  setFormTitle(
                                                    'Modifier la Livraison'
                                                  );
                                                  tog_form_modal();
                                                }}
                                              >
                                                <i className='bx bx-pencil align-center text-white'></i>
                                              </button>
                                            </div>

                                            <div className='remove'>
                                              <button
                                                className='btn btn-sm btn-danger remove-item-btn'
                                                data-bs-toggle='modal'
                                                data-bs-target='#deleteRecordModal'
                                                onClick={() => {
                                                  deleteButton(
                                                    livraison?._id,
                                                    livraison?.produit,
                                                    deleteLivraisonHistorique
                                                  );
                                                }}
                                              >
                                                <i className='ri-delete-bin-fill text-white'></i>
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                            </tbody>
                          </table>
                        )}
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
