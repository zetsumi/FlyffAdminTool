import Vue from 'vue';
import Prism from 'vue-prism-component';
import 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsonp';
import 'prismjs/components/prism-json5';
import 'prismjs/components/prism-powerquery';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-xquery';
import 'prismjs/themes/prism.css';

Vue.component('prism', Prism);
