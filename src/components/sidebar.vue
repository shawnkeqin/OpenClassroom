<template>
 <!--<sidebar-menu :menu="menu" /> -->
<div class="sidenav">
     <a-avatar shape="square" :size="64" icon="user" />
  <router-link to='/profile'>Profile</router-link>
  <router-link to='/mycourses'>My Courses</router-link>
  <router-link to='/searchcourses'>Search Courses</router-link>
  <router-link to='/observelog'>Observe Log</router-link>
  <br/>
   <br/>
    <br/>
     <br/>
      <br/>
       <br/>
         <br/>
   <br/>
    <br/>
     <br/>
      <br/>
       <br/>
                <br/>
   <br/>
    <br/>
     <br/>
      <br/>
       <br/>
                <br/>
   <br/>
    <br/>
     <br/>
      <br/>
       <br/>
        <br/>
      <br/>
  
         <router-link to='/profile'>FAQ</router-link>
  <router-link to='/mycourses'>Feedback</router-link>

</div>
  

</template>

<script>
//import router from '../router'
    export default {
        data() {
            return {
                menu: [
                    {
                        header: true,
                        title: 'Main Navigation',
                        hiddenOnCollapse: true,
                        
                    },
                    {
                        href: { path: './profile.vue' },
                        title: 'Profile',
                        icon: 'fa fa-user',
                        external: true
                        
                        
                    },
                    {
                        href: { path: './mycourses.vue' },
                        title: 'My Courses',
                        icon: 'fa fa-chart-area',
                         external: true
                        
                    
                    },
                    {
                        href: { path: './mycourses.vue' },
                        title: 'Visit History',
                        icon: 'fa fa-chart-area',
                    
                    },
                    {
                        href: '/',
                        title: 'Search Courses',
                        icon: 'fa fa-chart-area',
                    
                    },
                    {
                        href: '/',
                        title: 'App Feedback',
                        icon: 'fa fa-chart-area',
                    
                    },
                ],
                

            }
        }
  
    }
</script>

<style scoped>
.sidenav {
  height: 100%; /* Full-height: remove this if you want "auto" height */
  width: 160px; /* Set the width of the sidebar */
  position: fixed; /* Fixed Sidebar (stay in place on scroll) */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: #111; /* Black */
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 20px;
}
/* The navigation menu links */
.sidenav a {
  padding: 6px 8px 6px 16px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
}

/* When you mouse over the navigation links, change their color */
.sidenav a:hover {
  color: #f1f1f1;
}

/* Style page content */
.main {
  margin-left: 160px; /* Same as the width of the sidebar */
  padding: 0px 10px;
}

/* On smaller screens, where height is less than 450px, change the style of the sidebar (less padding and a smaller font size) */
@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}
</style> 

