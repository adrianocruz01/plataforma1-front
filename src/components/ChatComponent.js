import { useState, useEffect } from 'react';
import styles from '../pages/ChatComponent.module.css';

const ChatComponent = () => {
  const [contacts, setContacts] = useState([]);
  const [conversationsData, setConversationsData] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAIActive, setIsAIActive] = useState(true); // Novo estado para controlar a IA

  const conversationsEndpoint = `${process.env.NEXT_PUBLIC_BASEURL_TEXT}/api/message/conversations`;
  const sendMessageEndpoint = `${process.env.NEXT_PUBLIC_BASEURL_TEXT}/api/message/send`;
  const toggleAIEndpoint = `${process.env.NEXT_PUBLIC_BASEURL_TEXT}/api/message/toggle`; // Endpoint para ativar/desativar a IA

  // Função para formatar a data para o padrão brasileiro
  const formatDateToBrazil = (date) => {
    return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  };

  useEffect(() => {
    const storedUserString = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedUserString || !storedToken) {
      console.error('Nenhum dado encontrado no localStorage');
      setIsLoading(false);
      return;
    }

    let userData;
    try {
      userData = JSON.parse(storedUserString);
    } catch (error) {
      console.error('Erro ao fazer parse dos dados do usuário:', error);
      setIsLoading(false);
      return;
    }

    const { cliente } = userData;
    const { evolution } = cliente;

    if (!storedToken || !evolution?.id || !evolution?.token) {
      console.error('Token ou dados do Evolution não encontrados no localStorage');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`${conversationsEndpoint}?instance=${encodeURIComponent(evolution.id)}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          console.error('Erro ao buscar conversas, status:', response.status);
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        if (data && data.contacts && data.messages) {
          const updatedContacts = createContactsData(data.contacts, data.messages);
          setContacts(updatedContacts);
          setConversationsData(data.messages);

          if (updatedContacts.length > 0 && activeContact === null) {
            setActiveContact(updatedContacts[0].id);
          }
        } else {
          console.warn('Dados inválidos recebidos do backend.');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeContact) {
      fetchAIStatus();
    }
  }, [activeContact]);

  const createContactsData = (contactsData, conversationsData) => {
    return contactsData
      .map(contact => {
        const messages = conversationsData.filter(conversation => conversation.numero_whatsapp === contact.number);
        const lastMessageObj = messages[messages.length - 1];
        const lastMessageText = lastMessageObj?.texto || 'Nenhuma mensagem ainda';
        const lastTimestamp = lastMessageObj ? new Date(lastMessageObj.data_envio) : new Date(0);

        return {
          id: contact.id,
          name: contact.name,
          number: contact.number,
          avatar: contact.avatar,
          lastMessage: truncateMessage(lastMessageText),
          lastTimestamp: lastTimestamp,
        };
      })
      .sort((a, b) => b.lastTimestamp - a.lastTimestamp);
  };

  const truncateMessage = (message, maxLength = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  const sendMessage = async () => {
    if (messageInput.trim() === '') return;

    const storedUserString = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedUserString || !storedToken) {
      console.error('Dados do usuário não encontrados no localStorage');
      return;
    }

    let userData;
    try {
      userData = JSON.parse(storedUserString);
    } catch (error) {
      console.error('Erro ao fazer parse dos dados do usuário:', error);
      return;
    }

    const { cliente } = userData;
    const { evolution } = cliente;

    const contact = contacts.find(c => c.id === activeContact);

    if (!contact) {
      console.error('Contato ativo não encontrado');
      return;
    }

    const newMessage = {
      content: messageInput.trim(),
      instance: evolution.id,
      nome: cliente.nome,
      number: contact.number,
    };

    try {
      const response = await fetch(sendMessageEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar mensagem');
      }

      setMessageInput('');

      const messageData = {
        _id: Date.now().toString(),
        nome: 'Você',
        numero_whatsapp: contact.number,
        texto: newMessage.content,
        source: 'web',
        role: 'assistant',
        data_envio: new Date().toISOString(),
        data_envio_formatada: formatDateToBrazil(new Date()),
      };

      setConversationsData(prevData => {
        const updatedConversations = [...prevData, messageData];
        updateContactsList(contact.id, messageData);
        return updatedConversations;
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const updateContactsList = (contactId, lastMessage) => {
    setContacts(prevContacts => {
      const updatedContacts = prevContacts.map(contact =>
        contact.id === contactId
          ? {
              ...contact,
              lastMessage: truncateMessage(lastMessage.texto),
              lastTimestamp: new Date(lastMessage.data_envio),
            }
          : contact
      );
      return updatedContacts.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
    });
  };

  const handleContactClick = contactId => {
    setActiveContact(contactId);
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  const fetchAIStatus = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      console.error('Token não encontrado');
      return;
    }

    const contact = contacts.find(c => c.id === activeContact);
    if (!contact) {
      console.error('Contato ativo não encontrado');
      return;
    }

    try {
      const response = await fetch(`${toggleAIEndpoint}/status?number=${encodeURIComponent(contact.number)}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao obter o status da IA');
      }

      const data = await response.json();
      setIsAIActive(data.isAIActive);
    } catch (error) {
      console.error('Erro ao buscar status da IA:', error);
    }
  };

  const toggleAI = async () => {
    // const storedToken = localStorage.getItem('token');

    const storageData = JSON.parse(localStorage.getItem('user'));

    if (!storageData.cliente) {
        toast.error("Dados do cliente não encontrados no local storage.");
        return;
    }

    const evoId = storageData.cliente.evolution.id;
    const authlogin = storageData.token;

    const contact = contacts.find(c => c.id === activeContact);
    if (!contact) {
      console.error('Contato ativo não encontrado');
      return;
    }

    try {
      const newAIStatus = !isAIActive;
      setIsAIActive(newAIStatus);

      const response = await fetch(`${toggleAIEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authlogin}`,
        },
        body: JSON.stringify({
          number: contact.number,
          nome: contact.name,
          instance: evoId,
          isAIActive: newAIStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao alternar a IA');
      }
    } catch (error) {
      console.error('Erro ao alternar a IA:', error);
    }
  };

  useEffect(() => {
    if (activeContact) {
      const chatMessages = document.getElementById('chatMessages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }
  }, [activeContact, conversationsData]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!contacts.length) {
    return <div>Nenhum contato encontrado.</div>;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <input
            type="text"
            placeholder="Pesquisar ou começar uma nova conversa"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.contactsList}>
          {contacts
            .filter(
              contact =>
                contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.number.includes(searchTerm)
            )
            .map(contact => (
              <div
                key={contact.id}
                className={`${styles.contact} ${contact.id === activeContact ? styles.activeContact : ''}`}
                onClick={() => handleContactClick(contact.id)}
              >
                <div className={styles.contactAvatar}>{contact.avatar}</div>
                <div className={styles.contactInfo}>
                  <div className={styles.contactName}>{contact.name}</div>
                  <div className={styles.contactLastMessage}>{contact.lastMessage}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className={styles.chatArea}>
        <div className={styles.chatHeader}>
          {activeContact && (
            <>
              <div className={styles.contactAvatar}>
                {contacts.find(c => c.id === activeContact)?.avatar}
              </div>
              <div className={styles.contactInfo}>
                <div className={styles.contactName}>
                  {contacts.find(c => c.id === activeContact)?.name}
                </div>
              </div>
              {/* Botão para ativar/desativar a IA */}
              <button onClick={toggleAI} className={styles.toggleAIButton}>
                {isAIActive ? 'Desativar AI' : 'Ativar AI'}
              </button>
            </>
          )}
        </div>
        <div id="chatMessages" className={styles.chatMessages}>
          {conversationsData
            .filter(msg => msg.numero_whatsapp === contacts.find(c => c.id === activeContact)?.number)
            .sort((a, b) => new Date(a.data_envio) - new Date(b.data_envio))
            .map(msg => (
              <div
                key={msg._id}
                className={`${styles.message} ${
                  msg.role === 'assistant' ? styles.sent : styles.received
                }`}
              >
                <div className={styles.messageContent}>{msg.texto}</div>
                <div className={styles.messageTimestamp}>
                  {msg.data_envio_formatada || formatDateToBrazil(new Date(msg.data_envio))}
                </div>
              </div>
            ))}
        </div>
        <div className={styles.messageInput}>
          <input
            type="text"
            placeholder="Digite uma mensagem"
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
