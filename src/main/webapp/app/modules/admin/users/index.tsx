import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, InputGroup, Alert, Pagination } from 'react-bootstrap';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaUser,
  FaUserCheck,
  FaUserTimes,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaShieldAlt,
} from 'react-icons/fa';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'ADMIN' | 'USER' | 'MODERATOR';
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'USER' as 'ADMIN' | 'USER' | 'MODERATOR',
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    try {
      // Mock data - replace with actual API call
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@fshop.com',
          firstName: 'Admin',
          lastName: 'User',
          phone: '+84 123 456 789',
          role: 'ADMIN',
          isActive: true,
          lastLogin: '2024-01-20 10:30:00',
          createdAt: '2024-01-01',
          totalOrders: 0,
          totalSpent: 0,
        },
        {
          id: 2,
          username: 'john_doe',
          email: 'john.doe@email.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+84 987 654 321',
          role: 'USER',
          isActive: true,
          lastLogin: '2024-01-19 15:45:00',
          createdAt: '2024-01-05',
          totalOrders: 12,
          totalSpent: 2500000,
        },
        {
          id: 3,
          username: 'jane_smith',
          email: 'jane.smith@email.com',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+84 555 123 456',
          role: 'USER',
          isActive: true,
          lastLogin: '2024-01-18 09:20:00',
          createdAt: '2024-01-08',
          totalOrders: 8,
          totalSpent: 1800000,
        },
        {
          id: 4,
          username: 'moderator1',
          email: 'mod@fshop.com',
          firstName: 'Moderator',
          lastName: 'One',
          phone: '+84 111 222 333',
          role: 'MODERATOR',
          isActive: true,
          lastLogin: '2024-01-20 08:15:00',
          createdAt: '2024-01-10',
          totalOrders: 0,
          totalSpent: 0,
        },
        {
          id: 5,
          username: 'inactive_user',
          email: 'inactive@email.com',
          firstName: 'Inactive',
          lastName: 'User',
          phone: '+84 999 888 777',
          role: 'USER',
          isActive: false,
          lastLogin: '2024-01-10 14:30:00',
          createdAt: '2024-01-12',
          totalOrders: 3,
          totalSpent: 450000,
        },
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'USER',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    });
    setShowModal(true);
  };

  const handleSaveUser = () => {
    // Handle save logic here
    console.log('Saving user:', formData);
    setShowModal(false);
    fetchUsers(); // Refresh the list
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log('Deleting user:', userToDelete);
    setShowDeleteModal(false);
    setUserToDelete(null);
    fetchUsers(); // Refresh the list
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge bg="danger">Admin</Badge>;
      case 'MODERATOR':
        return <Badge bg="warning">Moderator</Badge>;
      default:
        return <Badge bg="primary">User</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? <Badge bg="success">Active</Badge> : <Badge bg="secondary">Inactive</Badge>;
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>User Management</h2>
              <p className="text-muted">Manage system users and their permissions</p>
            </div>
            <Button variant="primary" onClick={handleAddUser}>
              <FaPlus className="me-2" />
              Add User
            </Button>
          </div>
        </Col>
      </Row>

      {/* Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="bg-primary text-white rounded-circle p-3 mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                <FaUser size={24} />
              </div>
              <h4 className="mb-1">{users.length}</h4>
              <p className="text-muted mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="bg-success text-white rounded-circle p-3 mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                <FaUserCheck size={24} />
              </div>
              <h4 className="mb-1">{users.filter(u => u.isActive).length}</h4>
              <p className="text-muted mb-0">Active Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="bg-warning text-white rounded-circle p-3 mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                <FaShieldAlt size={24} />
              </div>
              <h4 className="mb-1">{users.filter(u => u.role === 'ADMIN' || u.role === 'MODERATOR').length}</h4>
              <p className="text-muted mb-0">Staff Members</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="bg-info text-white rounded-circle p-3 mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                <FaUserTimes size={24} />
              </div>
              <h4 className="mb-1">{users.filter(u => !u.isActive).length}</h4>
              <p className="text-muted mb-0">Inactive Users</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MODERATOR">Moderator</option>
            <option value="USER">User</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <div className="d-flex justify-content-end">
            <small className="text-muted align-self-center">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
            </small>
          </div>
        </Col>
      </Row>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Activity</th>
                <th>Orders</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary text-white rounded-circle p-2 me-3" style={{ width: '40px', height: '40px' }}>
                        <FaUser />
                      </div>
                      <div>
                        <div className="fw-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <small className="text-muted">@{user.username}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="d-flex align-items-center mb-1">
                        <FaEnvelope className="me-2 text-muted" size={12} />
                        <small>{user.email}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaPhone className="me-2 text-muted" size={12} />
                        <small>{user.phone}</small>
                      </div>
                    </div>
                  </td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{getStatusBadge(user.isActive)}</td>
                  <td>
                    <div>
                      <div className="d-flex align-items-center mb-1">
                        <FaCalendarAlt className="me-2 text-muted" size={12} />
                        <small>Joined: {user.createdAt}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <small className="text-muted">Last login: {user.lastLogin}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-medium">{user.totalOrders} orders</div>
                      <small className="text-muted">{user.totalSpent.toLocaleString()} VND</small>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-warning" size="sm" title="Edit" onClick={() => handleEditUser(user)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" title="Delete" onClick={() => handleDeleteUser(user)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Row className="mt-4">
          <Col>
            <div className="d-flex justify-content-center">
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                    {page}
                  </Pagination.Item>
                ))}

                <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          </Col>
        </Row>
      )}

      {/* Add/Edit User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Username *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter username"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role *</Form.Label>
                  <Form.Select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'USER' | 'MODERATOR' })}
                  >
                    <option value="USER">User</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="ADMIN">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="isActive"
                label="Active User"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            {editingUser ? 'Update User' : 'Add User'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete user &quot;{userToDelete?.username}&quot;? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;
