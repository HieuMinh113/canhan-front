import { createRouter, createWebHistory } from 'vue-router';


//login and register pages
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import LoginSuccess from '../views/LoginSuccess.vue';
//customer pages
import AppointmentsPage from '../views/customer/AppointmentsPage.vue';
import BookingPage from '../views/customer/BookingPage.vue';
import CartPage from '../views/customer/CartPage.vue';
import ContactPage from '../views/customer/ContactPage.vue';
import FeedbackPage from '../views/customer/FeedbackPage.vue';
import HomePage from '../views/customer/HomePage.vue';  
import HotelPage from '../views/customer/HotelPage.vue';
import NewsdetailPage from '../views/customer/NewsdetailPage.vue';
import NewsPage from '../views/customer/NewsPage.vue';
import ProductsdetailsPage from '../views/customer/ProductsdetailsPage.vue';
import ProductsPage from '../views/customer/ProductsPage.vue';
import HotelDetailPage from '../views/customer/HotelDetailPage.vue';
import ProfilePage from '../views/customer/ProfilePage.vue';
//admin pages
import AdminAppointmentsPage from '../views/admin/AdminAppointmentsPage.vue';
import AdminBookingPage from '../views/admin/AdminBookingPage.vue';
import AdminContactPage from '../views/admin/AdminContactPage.vue';
import AdminHotelPage from '../views/admin/AdminHotelPage.vue';
import AdminManagementPage from '../views/admin/AdminManagementPage.vue';
import AdminNewsPage from '../views/admin/AdminNewsPage.vue';
import AdminPage from '../views/admin/AdminPage.vue';
import AdminProductPage from '../views/admin/AdminProductPage.vue';
import AdminWorkPage from '../views/admin/AdminWorkPage.vue';
import AdminBillPage from '../views/admin/AdminBillPage.vue';
import AdminBillDetailPage from '../views/admin/AdminBillDetailPage.vue';
import AdminBannerPage from '../views/admin/AdminBannerPage.vue';
import AdminPetPage from '../views/admin/AdminPetPage.vue';
import AdminCouponPage from '../views/admin/AdminCouponPage.vue';
import AdminPetStockPage from '../views/admin/AdminPetStockPage.vue';
import AdminProductStockPage from '../views/admin/AdminProductStockPage.vue';
//staff pages
import StaffPage from '../views/staff/StaffPage.vue';
import StaffAppointmentsPage from '../views/staff/StaffAppointmentsPage.vue';
import StaffBookingHotelPage from '@/views/staff/StaffBookingHotelPage.vue';
import StaffBillPage from '../views/staff/StaffBillPage.vue';
import StaffWorkPage from '../views/staff/StaffWorkPage.vue';
import StaffBillDetailPage from '../views/staff/StaffBillDetailPage.vue';
//doctor pages
import DoctorPage from '../views/Doctor/DoctorPage.vue';
import DoctorBillPage from '../views/Doctor/DoctorBillPage.vue';
import DoctorBookingPage from '../views/Doctor/DoctorBookingPage.vue';
import DoctorWorkPage from '../views/Doctor/DoctorWorkPage.vue';
import DoctorBillDetailPage from '../views/Doctor/DoctorBillDetailPage.vue';
import AdminFeedbackPage from '@/views/admin/AdminFeedbackPage.vue';
import AdminBookingHotelPage from '@/views/admin/AdminBookingHotelPage.vue';
import FogotPage from '@/views/FogotPage.vue';
import ResetPage from '@/views/ResetPage.vue';
import LoginGitSuccess from '@/views/LoginGitSuccess.vue';
import AdminServicePage from '@/views/admin/AdminServicePage.vue';
import PetsPage from '@/views/customer/PetsPage.vue';
import PetdetailsPage from '@/views/customer/PetdetailsPage.vue';
import ProductChart from '@/views/chart/ProductChart.vue';
import PetChart from '@/views/chart/PetChart.vue';
import UserChart from '@/views/chart/UserChart.vue';
import HotelChart from '@/views/chart/HotelChart.vue';
import BillChart from '@/views/chart/BillChart.vue';
import Loyalty from '@/views/admin/AdminRankPage.vue';



const routes = [
//login and register
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/forgot', name: 'Fogot', component: FogotPage },
  { path: '/reset', name: 'Reset', component: ResetPage},
//customer pages
  { path: '/appointments', name: 'Appointments', component: AppointmentsPage },
  { path: '/booking', name: 'Booking', component: BookingPage },
  { path: '/cart', name: 'Cart', component: CartPage },
  { path: '/contact', name: 'Contact', component: ContactPage },
  { path: '/feedback', name: 'Feedback', component: FeedbackPage },
  { path: '/', name: 'Home', component: HomePage },
  { path: '/hotel', name: 'Hotel', component: HotelPage },
  { path: '/news/:id', name: 'NewsDetail', component: NewsdetailPage },
  { path: '/news', name: 'News', component: NewsPage },
  { path: '/product/:id', name: 'ProductDetail', component: ProductsdetailsPage,prop:true },
  { path: '/products', name: 'Products', component: ProductsPage },
  { path: '/hotel/:id', name: 'HotelDetail', component: HotelDetailPage,prop:true },
  {path:'/profile',name:'Profile',component:ProfilePage},
  { path: '/login-success', name: 'LoginSuccess', component: LoginSuccess },
  { path: '/login-git-success', name: 'LoginGitSuccess', component: LoginGitSuccess },
  { path: '/pets', name: 'Pets', component: PetsPage },
  { path: '/pets/:id', name: 'Petsdetail', component: PetdetailsPage },
//admin pages
  {path: '/adminappointments', name:'AdminAppointments', component: AdminAppointmentsPage,meta: { requiresAuth: true, role: 'admin' }},
  {path: '/adminbooking', name:'AdminBooking', component: AdminBookingPage,meta: { requiresAuth: true, role: 'admin' }},
  {path: '/admincontact', name:'AdminContact', component: AdminContactPage,meta: { requiresAuth: true, role: 'admin' }},
  {path: '/adminhotel', name:'AdminHotel', component: AdminHotelPage,meta: { requiresAuth: true, role: 'admin' }},
  {path: '/adminmanagement', name:'AdminManagement', component: AdminManagementPage,meta: { requiresAuth: true, role: 'admin' }},
  {path: '/adminnews', name:'AdminNews', component: AdminNewsPage,meta: { requiresAuth: true, role: 'admin' }},
  {path: '/admin', name:'Admin', component: AdminPage,meta: { requiresAuth: true, role: 'admin' }},
  {path: '/adminproduct', name:'AdminProducts', component: AdminProductPage,meta: { requiresAuth: true, role: 'admin' }},
  {path: '/adminwork', name:'AdminWork', component: AdminWorkPage,meta: { requiresAuth: true, role: 'admin' }},
  {path: '/adminfeedback', name:AdminFeedbackPage, component: AdminFeedbackPage,meta: { requiresAuth: true, role: 'admin' }},
  {path:'/admibookinghotel',name:AdminBookingHotelPage,component:AdminBookingHotelPage,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/adminservice', name: 'Service', component: AdminServicePage ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/adminbill', name: 'AdminBill', component: AdminBillPage ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/adminbilldetail/:id', name: 'AdminBillDetail', component: AdminBillDetailPage ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/adminbanner', name: 'AdminBannerPage', component: AdminBannerPage ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/adminpet', name: 'AdminPetPage', component: AdminPetPage ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/admincoupon', name: 'AdminCouponPage', component: AdminCouponPage ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/adminstockpet', name: 'AdminPetStockPage', component: AdminPetStockPage ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/adminstockproduct', name: 'AdminProductStockPage', component: AdminProductStockPage ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/productchart', name: 'ProductChart', component: ProductChart ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/petchart', name: 'PetChart', component: PetChart ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/userchart', name: 'UserChart', component: UserChart ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/hotelchart', name: 'HotelChart', component: HotelChart ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/billchart', name: 'BillChart', component: BillChart ,meta:{ requiresAuth: true, role: 'admin' }},
  { path:'/loyalty', name: 'BillLoyalty', component: Loyalty ,meta:{ requiresAuth: true, role: 'admin' }},
  //staff pages
  {path: '/staff/:id', name:'Staff', component: StaffPage},
  {path: '/staffappointments/:id', name:'StaffAppointments', component: StaffAppointmentsPage,meta: { requiresAuth: true, role: 'staff' }},
  {path: '/staffbookinghotel', name:'StaffBookingHotelPage', component: StaffBookingHotelPage,meta: { requiresAuth: true, role: 'staff' }},
  {path: '/staffbill', name:'StaffBill', component: StaffBillPage,meta: { requiresAuth: true, role: 'staff' }},
  {path: '/staffwork', name:'StaffWork', component: StaffWorkPage,meta: { requiresAuth: true, role: 'staff' }},
  {path: '/staffbilldetail/:id', name:'StaffBillDetail', component: StaffBillDetailPage,meta: { requiresAuth: true, role: 'staff' }},
  
//doctor pages
  {path: '/doctor/:id', name:'Doctor', component: DoctorPage,meta: { requiresAuth: true, role: 'doctor' }},
  {path: '/doctorbill', name:'DoctorBill', component: DoctorBillPage,meta: { requiresAuth: true, role: 'doctor' }},
  {path: '/doctorbooking/:id', name:'DoctorBooking', component: DoctorBookingPage,meta: { requiresAuth: true, role: 'doctor' }},
  {path: '/doctorwork', name:'DoctorWork', component: DoctorWorkPage,meta: { requiresAuth: true, role: 'doctor' }},
  {path: '/doctorBillDetail/:id', name:'DoctorBillDetail', component: DoctorBillDetailPage ,meta: { requiresAuth: true, role: 'doctor' }},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token');
  const role = localStorage.getItem('user_role');

  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  if (to.meta.role && role !== to.meta.role) {
    return next('/');
  }

  next();
});

export default router;
