import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { config } from '@/constants/config';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: '/about' },
        { text: 'Our Mission', href: '/mission' },
        { text: 'Careers', href: '/careers' },
        { text: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Products',
      links: [
        { text: 'RO Systems', href: '/products/ro-systems' },
        { text: 'Water Filters', href: '/products/filters' },
        { text: 'Accessories', href: '/products/accessories' },
        { text: 'Maintenance', href: '/services/maintenance' },
      ],
    },
    {
      title: 'Services',
      links: [
        { text: 'Installation', href: '/services/installation' },
        { text: 'Maintenance', href: '/services/maintenance' },
        { text: 'Repair', href: '/services/repair' },
        { text: 'Support', href: '/support' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Help Center', href: '/help' },
        { text: 'FAQs', href: '/faqs' },
        { text: 'Warranty', href: '/warranty' },
        { text: 'Contact Support', href: '/support' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Facebook />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <LinkedIn />, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1f2937',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {config.app.name}
              </Typography>
              <Typography variant="body2" color="grey.300" sx={{ mb: 2 }}>
                {config.app.description}
              </Typography>
            </Box>

            {/* Contact Info */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ fontSize: 16, mr: 1, color: 'grey.400' }} />
                <Typography variant="body2" color="grey.300">
                  {config.contact.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ fontSize: 16, mr: 1, color: 'grey.400' }} />
                <Typography variant="body2" color="grey.300">
                  {config.contact.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ fontSize: 16, mr: 1, color: 'grey.400' }} />
                <Typography variant="body2" color="grey.300">
                  {config.contact.address}
                </Typography>
              </Box>
            </Box>

            {/* Social Links */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'grey.300',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={2} key={section.title}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.text} sx={{ mb: 1 }}>
                    <Link
                      href={link.href}
                      color="grey.300"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            borderTop: 1,
            borderColor: 'grey.700',
            mt: 4,
            pt: 3,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 2 : 0,
          }}
        >
          <Typography variant="body2" color="grey.400">
            © {currentYear} {config.app.name}. All rights reserved.
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexDirection: isMobile ? 'column' : 'row',
            }}
          >
            <Link
              href="/privacy"
              color="grey.400"
              sx={{
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              color="grey.400"
              sx={{
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="/sitemap"
              color="grey.400"
              sx={{
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Sitemap
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
