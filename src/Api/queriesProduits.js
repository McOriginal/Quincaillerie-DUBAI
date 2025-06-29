import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle produits
export const useCreateProduit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/produits/addProduit', data),
    onSuccess: () => queryClient.invalidateQueries(['produits']),
  });
};

// Mettre à jour une produits
export const useUpdateProduit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/produits/updateProduit/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['produits']),
  });
};

// Lire toutes les produits
export const useAllProduit = () =>
  useQuery({
    queryKey: ['produits'],
    queryFn: () => api.get('/produits/getAllProduits').then((res) => res.data),
  });

// Produit dont le Stock est terminé
export const useAllProduitWithStockInferieure = () =>
  useQuery({
    queryKey: ['produits'],
    queryFn: () =>
      api.get('/produits/getAllProduitWithStockFinish').then((res) => res.data),
  });

// Obtenir un Produit
export const useOneProduit = (id) =>
  useQuery({
    queryKey: ['getProduit', id],
    queryFn: () =>
      api.get(`/produits/getOneProduit/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Affficher le produit lors de l'approvisonnement
export const useOneProduitWhenApprovisionne = (id) =>
  useQuery({
    queryKey: ['getProduit', id],
    queryFn: () => api.get(`/approvisonnement/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Ajouter une COMMANDE et Decrementer la quantité au Stock de PRODUIT
export const useDecrementMultipleStocks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items) =>
      api.post('/produits/decrementMultipleStocks', { items }),
    onSuccess: () => queryClient.invalidateQueries(['produits']),
  });
};

// Annuler une Commande et Mettre à jour le Stock
export const useCancelDecrementMultipleStocks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commandeId, items }) =>
      api.post(`/produits/cancelDecrementMultipleStocks/${commandeId}`, {
        items,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['produits']);
      queryClient.invalidateQueries(['commandes']); // si tu veux la liste à jour
    },
  });
};

// Supprimer une produits
export const useDeleteProduit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/produits/deleteProduit/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['produits']),
  });
};
