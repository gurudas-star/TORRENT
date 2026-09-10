import { FlowNodeId, FlowStepConfig } from './types';
import { MOCK_BILLS, DEFAULT_DEMO_BILL, MOCK_OUTAGES } from '../data/mockData';

export const FLOW_CONFIG: Record<FlowNodeId, FlowStepConfig> = {
  // ═════════════════════════════════════════════════════════════════════════
  // MAIN MENU (Annexure-3 Official Standard)
  // ═════════════════════════════════════════════════════════════════════════
  main_menu: {
    id: 'main_menu',
    message: "Welcome to Torrent Power ANN Digital Assistant. Please select a service category below (as per Annexure-3 Functional Menu):",
    options: [
      { id: 'm1', label: '1. Register No Power Complaint', nextFlowId: 'no_power_start', variant: 'primary' },
      { id: 'm2', label: '2. Application Related', nextFlowId: 'app_related_start' },
      { id: 'm3', label: '3. New Connection', nextFlowId: 'connection_start' },
      { id: 'm4', label: '4. View Bill & Payment', nextFlowId: 'bill_payment_start', variant: 'primary' },
      { id: 'm5', label: '5. Meter Related Request', nextFlowId: 'meter_request_start' },
      { id: 'm6', label: '6. Meter Reading', nextFlowId: 'meter_reading_start' },
      { id: 'm7', label: '7. Update your details', nextFlowId: 'update_details_start' },
      { id: 'm8', label: '8. Safety Related', nextFlowId: 'safety_related_start' },
      { id: 'm9', label: '9. Theft reporting', nextFlowId: 'theft_reporting_start' },
      { id: 'm10', label: '10. Helpline Nos', nextFlowId: 'helpline_nos_start', variant: 'accent' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CATEGORY 1: REGISTER NO POWER COMPLAINT
  // ═════════════════════════════════════════════════════════════════════════
  no_power_start: {
    id: 'no_power_start',
    message: 'Register No Power Complaint Desk. Please select the specific issue:',
    options: [
      { id: 'np1', label: 'No Power (Complete Outage)', nextFlowId: 'no_power_input', payload: { category: 'No Power' }, variant: 'primary' },
      { id: 'np2', label: 'Voltage Fluctuation', nextFlowId: 'no_power_input', payload: { category: 'Voltage Fluctuation' } },
      { id: 'np_back', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  no_power_input: {
    id: 'no_power_input',
    message: (ctx) => `Selected Issue: ${ctx.category || 'No Power'}.\nPlease enter your 8-digit Customer Number or Area Pincode:`,
    requiresInput: true,
    inputPlaceholder: 'e.g. 10023456 or 380015',
    options: [
      { id: 'np_demo1', label: 'Use Demo Acc #10023456', nextFlowId: 'no_power_result', payload: { customerNumber: '10023456' } },
      { id: 'np_demo2', label: 'Check Area Pincode 380015', nextFlowId: 'no_power_result', payload: { customerNumber: '380015' } },
      { id: 'np_b', label: 'Back', nextFlowId: 'no_power_start' }
    ],
    processInput: (val) => {
      return { nextFlowId: 'no_power_result', contextUpdates: { customerNumber: val.trim() || '10023456' } };
    }
  },
  no_power_result: {
    id: 'no_power_result',
    message: (ctx) => {
      const acc = ctx.customerNumber || '10023456';
      const ticketId = 'OUT-' + Math.floor(100000 + Math.random() * 900000);
      return `Complaint Logged Successfully!\n• Ticket ID: ${ticketId}\n• Issue Type: ${ctx.category || 'No Power'}\n• Reference Account/Pincode: ${acc}\n• Status: DISPATCHED TO FIELD RESPONSE CREW\n• SLA Restoration: Within 2 Hours\n\nOur technical team is deployed to resolve feeder restoration. Notification SMS will be sent to your mobile.`;
    },
    options: [
      { id: 'np_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CATEGORY 2: APPLICATION RELATED
  // ═════════════════════════════════════════════════════════════════════════
  app_related_start: {
    id: 'app_related_start',
    message: 'Application Related Services Portal. Select sub-category:',
    options: [
      { id: 'ar1', label: 'Name Change Related', nextFlowId: 'app_name_change' },
      { id: 'ar2', label: 'Extension/Reduction Related (Load Shift)', nextFlowId: 'app_load_change' },
      { id: 'ar3', label: 'Meter Shifting Related', nextFlowId: 'app_meter_shift' },
      { id: 'ar4', label: 'Service Removal Application', nextFlowId: 'app_service_removal' },
      { id: 'ar5', label: 'Application Status', nextFlowId: 'app_status_check', variant: 'primary' },
      { id: 'ar_b', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  app_name_change: {
    id: 'app_name_change',
    message: 'Name Change Application Requirements:\n1. Registered Property Transfer Deed / Index II\n2. NOC from Previous Owner / Death Certificate (if applicable)\n3. Identity Proof (Aadhaar / PAN)\n4. Last Paid Electricity Bill Receipt\n\nFee: ₹250 Processing Charge + Security Deposit Adjustment.',
    options: [
      { id: 'anc_sub', label: 'Submit Online Application', nextFlowId: 'app_submit_ack', payload: { type: 'Name Change' }, variant: 'primary' },
      { id: 'anc_b', label: 'Back to Application Menu', nextFlowId: 'app_related_start' }
    ]
  },
  app_load_change: {
    id: 'app_load_change',
    message: 'Load Extension / Reduction Application:\n• Extension: Test Report by Licensed Electrical Contractor + Load Demand Notice.\n• Reduction: Declaration Form + Connected Load Inspection.\n\nProcessing Time: 3 Business Days post inspection.',
    options: [
      { id: 'alc_sub', label: 'Submit Load Revision Application', nextFlowId: 'app_submit_ack', payload: { type: 'Load Revision' }, variant: 'primary' },
      { id: 'alc_b', label: 'Back to Application Menu', nextFlowId: 'app_related_start' }
    ]
  },
  app_meter_shift: {
    id: 'app_meter_shift',
    message: 'Meter Shifting Application:\n• Permissible within same premises / boundary wall.\n• Site Feasibility Inspection by Field Inspector.\n• Shifting Estimate Fee payable post inspection.',
    options: [
      { id: 'ams_sub', label: 'Request Meter Shifting Inspection', nextFlowId: 'app_submit_ack', payload: { type: 'Meter Shifting' }, variant: 'primary' },
      { id: 'ams_b', label: 'Back to Application Menu', nextFlowId: 'app_related_start' }
    ]
  },
  app_service_removal: {
    id: 'app_service_removal',
    message: 'Permanent Service Removal Application:\n• Final Bill Settlement & Clearance Certificate required.\n• Meter & Service Cable surrender.\n• Refund of Security Deposit post final audit.',
    options: [
      { id: 'asr_sub', label: 'Apply for Permanent Removal', nextFlowId: 'app_submit_ack', payload: { type: 'Service Removal' }, variant: 'primary' },
      { id: 'asr_b', label: 'Back to Application Menu', nextFlowId: 'app_related_start' }
    ]
  },
  app_status_check: {
    id: 'app_status_check',
    message: 'Please enter your Application Reference Number (e.g. APP-2026-9921):',
    requiresInput: true,
    inputPlaceholder: 'e.g. APP-2026-9921',
    options: [
      { id: 'asc_demo', label: 'Check Status for Demo APP-2026-9921', nextFlowId: 'app_status_result', payload: { appNo: 'APP-2026-9921' } },
      { id: 'asc_b', label: 'Back', nextFlowId: 'app_related_start' }
    ],
    processInput: (val) => {
      return { nextFlowId: 'app_status_result', contextUpdates: { appNo: val.trim() || 'APP-2026-9921' } };
    }
  },
  app_status_result: {
    id: 'app_status_result',
    message: (ctx) => {
      const appNo = ctx.appNo || 'APP-2026-9921';
      return `Application Status Report (${appNo}):\n• Application Type: Load Extension / Service Modification\n• Status: UNDER SITE INSPECTION BY FIELD ENGINEER\n• Inspection Date Scheduled: Tomorrow, 11:30 AM\n• Assigned Officer: Er. R. K. Patel (+91-98250-XXXXX)\n• Next Step: Technical Feasibility Clearance.`;
    },
    options: [
      { id: 'asr_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  app_submit_ack: {
    id: 'app_submit_ack',
    message: (ctx) => {
      const appNo = 'APP-2026-' + Math.floor(1000 + Math.random() * 9000);
      return `Application Submitted Successfully!\n• Reference No: ${appNo}\n• Category: ${ctx.type || 'Application Modification'}\n• Status: DOCS PRE-VERIFIED (PENDING INSPECTION)\n\nYou will receive SMS updates on your registered mobile.`;
    },
    options: [
      { id: 'ack_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CATEGORY 3: NEW CONNECTION
  // ═════════════════════════════════════════════════════════════════════════
  connection_start: {
    id: 'connection_start',
    message: 'New Power Connection Desk. Select connection type:',
    options: [
      { id: 'conn_res', label: 'Residential Low Tension (LT Supply)', nextFlowId: 'connection_guide', payload: { type: 'Residential' } },
      { id: 'conn_comm', label: 'Commercial & Retail Connection', nextFlowId: 'connection_guide', payload: { type: 'Commercial' } },
      { id: 'conn_ind', label: 'Industrial High Tension (HT Supply)', nextFlowId: 'connection_guide', payload: { type: 'Industrial' } },
      { id: 'conn_b', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  connection_guide: {
    id: 'connection_guide',
    message: (ctx) => {
      const type = ctx.connType || 'Residential';
      return `Documentation Checklist for ${type} Supply:\n1. Proof of Ownership (Sale Deed / Lease Index II)\n2. Identity Proof (Aadhaar Card / PAN Card)\n3. Passport Photo\n4. Electrical Wiring Completion Certificate\n\nProcessing SLA: 3 to 5 business days post inspection.`;
    },
    options: [
      { id: 'start_app_demo', label: 'Begin Digital Application Process', nextFlowId: 'connection_docs', variant: 'primary' },
      { id: 'ret_menu_conn', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  connection_docs: {
    id: 'connection_docs',
    message: 'Reference Application No: APP-2026-9921 generated. Proceed to upload documents & book inspection slot.',
    options: [
      { id: 'done_conn', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CATEGORY 4: VIEW BILL & PAYMENT
  // ═════════════════════════════════════════════════════════════════════════
  bill_payment_start: {
    id: 'bill_payment_start',
    message: 'View Bill & Payment Portal. Select your sub-category:',
    options: [
      { id: 'bp1', label: 'Bill Amount', nextFlowId: 'view_bill_input', variant: 'primary' },
      { id: 'bp2', label: 'Duplicate Bill', nextFlowId: 'duplicate_bill_input' },
      { id: 'bp3', label: 'Last Payment details', nextFlowId: 'last_payment_input' },
      { id: 'bp_b', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  view_bill_input: {
    id: 'view_bill_input',
    message: 'Please enter your 8-digit Customer Number to view current bill amount:',
    requiresInput: true,
    inputType: 'customerNumber',
    inputPlaceholder: 'e.g. 10023456',
    options: [
      { id: 'vb_d1', label: 'Demo Acc #10023456 (₹2,450)', nextFlowId: 'view_bill_details', payload: { customerNumber: '10023456' } },
      { id: 'vb_b', label: 'Back', nextFlowId: 'bill_payment_start' }
    ],
    processInput: (val) => {
      const cleanVal = val.trim();
      const bill = MOCK_BILLS[cleanVal] || { ...DEFAULT_DEMO_BILL, customerNumber: cleanVal || '10023456' };
      return { nextFlowId: 'view_bill_details', contextUpdates: { selectedBill: bill } };
    }
  },
  view_bill_details: {
    id: 'view_bill_details',
    message: (ctx) => {
      const b = ctx.selectedBill || DEFAULT_DEMO_BILL;
      return `Bill Amount Details:\nCustomer: ${b.customerName}\nAccount #: ${b.customerNumber}\nBill Period: ${b.billingPeriod}\nUnits Consumed: ${b.unitsConsumed} kWh\nTotal Amount Payable: ₹${b.amount}\nDue Date: ${b.dueDate}\nStatus: ${b.status}`;
    },
    options: (ctx) => [
      { id: 'pay_from_view', label: 'Pay Now (₹' + (ctx.selectedBill?.amount || 2450) + ')', nextFlowId: 'pay_bill_success', variant: 'primary' },
      { id: 'dup_dl', label: 'Download Duplicate Bill PDF', nextFlowId: 'duplicate_bill_download' },
      { id: 'menu_ret', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  duplicate_bill_input: {
    id: 'duplicate_bill_input',
    message: 'Please enter your Customer Number to download duplicate bill PDF:',
    requiresInput: true,
    inputPlaceholder: 'e.g. 10023456',
    options: [
      { id: 'db_d1', label: 'Use Acc #10023456', nextFlowId: 'duplicate_bill_download' }
    ],
    processInput: () => ({ nextFlowId: 'duplicate_bill_download' })
  },
  duplicate_bill_download: {
    id: 'duplicate_bill_download',
    message: 'Duplicate Bill PDF Generated:\n• Statement Period: August 2026\n• Document Hash: PDF-TPL-88392-AUG\n• Status: VERIFIED DIGITAL COPY\n\nClick below to download the official duplicate bill receipt.',
    options: [
      { id: 'db_dl_act', label: 'Download Official PDF Copy', nextFlowId: 'main_menu', variant: 'primary' },
      { id: 'db_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  last_payment_input: {
    id: 'last_payment_input',
    message: 'Please enter Customer Number to view last payment transaction history:',
    requiresInput: true,
    inputPlaceholder: 'e.g. 10023456',
    options: [
      { id: 'lp_d1', label: 'Use Acc #10023456', nextFlowId: 'last_payment_details' }
    ],
    processInput: () => ({ nextFlowId: 'last_payment_details' })
  },
  last_payment_details: {
    id: 'last_payment_details',
    message: 'Last Payment Details:\n• Transaction ID: TXN-882194\n• Date & Time: 02-Aug-2026, 04:12 PM\n• Amount Paid: ₹2,450.00\n• Payment Mode: UPI (GPay/PhonePe)\n• Payment Status: SUCCESSFUL & CREDITED',
    options: [
      { id: 'lp_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  pay_bill_success: {
    id: 'pay_bill_success',
    message: (ctx) => {
      const bill = ctx.selectedBill || DEFAULT_DEMO_BILL;
      const txn = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
      return `Payment Successful!\n• Transaction ID: ${txn}\n• Amount Settled: ₹${bill.amount.toLocaleString()}\n• Account Number: ${bill.customerNumber}\n\nSMS confirmation sent. Thank you for using Torrent Power Services.`;
    },
    options: [
      { id: 'back_menu', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CATEGORY 5: METER RELATED REQUEST
  // ═════════════════════════════════════════════════════════════════════════
  meter_request_start: {
    id: 'meter_request_start',
    message: 'Meter Related Request Portal. Please select the issue:',
    options: [
      { id: 'mr1', label: 'Meter Fast (High Consumption Defect)', nextFlowId: 'meter_fast_ticket', variant: 'primary' },
      { id: 'mr2', label: 'Meter Defective (Display / Stop Defect)', nextFlowId: 'meter_defective_ticket' },
      { id: 'mr_b', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  meter_fast_ticket: {
    id: 'meter_fast_ticket',
    message: 'Meter Fast Complaint Registration:\n• Meter Check Testing SLA: 48 Hours\n• NABL Accredited Meter Lab Check\n\nPlease enter your 8-digit Customer Number:',
    requiresInput: true,
    inputPlaceholder: 'e.g. 10023456',
    options: [
      { id: 'mf_d1', label: 'Use Acc #10023456', nextFlowId: 'meter_ack', payload: { category: 'Meter Running Fast' } }
    ],
    processInput: (val) => ({ nextFlowId: 'meter_ack', contextUpdates: { category: 'Meter Running Fast', acc: val.trim() || '10023456' } })
  },
  meter_defective_ticket: {
    id: 'meter_defective_ticket',
    message: 'Meter Defective / Display Blank Complaint:\n• Field Inspection & Replacement Request\n\nPlease enter your 8-digit Customer Number:',
    requiresInput: true,
    inputPlaceholder: 'e.g. 10023456',
    options: [
      { id: 'md_d1', label: 'Use Acc #10023456', nextFlowId: 'meter_ack', payload: { category: 'Meter Defective / Blank' } }
    ],
    processInput: (val) => ({ nextFlowId: 'meter_ack', contextUpdates: { category: 'Meter Defective / Blank', acc: val.trim() || '10023456' } })
  },
  meter_ack: {
    id: 'meter_ack',
    message: (ctx) => {
      const ticketId = 'MTR-' + Math.floor(100000 + Math.random() * 900000);
      return `Meter Service Request Logged!\n• Ticket ID: ${ticketId}\n• Request Type: ${ctx.category || 'Meter Inspection'}\n• Customer Number: ${ctx.acc || '10023456'}\n• Status: SCHEDULED FOR METER TESTING\n• Inspector Visit: Within 2 Business Days.`;
    },
    options: [
      { id: 'mtr_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CATEGORY 6: METER READING
  // ═════════════════════════════════════════════════════════════════════════
  meter_reading_start: {
    id: 'meter_reading_start',
    message: 'Meter Reading Portal. Select option:',
    options: [
      { id: 'mread1', label: 'Meter Reading Date Information', nextFlowId: 'meter_reading_date' },
      { id: 'mread2', label: 'Meter Reading Submission (Self Reading)', nextFlowId: 'meter_reading_submit', variant: 'primary' },
      { id: 'mread_b', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  meter_reading_date: {
    id: 'meter_reading_date',
    message: 'Meter Reading Schedule Information:\n• Your Zone Meter Reading Date: 28th of every month\n• Next Scheduled Meter Reader Visit: 28-Sept-2026\n• Billing Cycle: Monthly',
    options: [
      { id: 'mrd_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  meter_reading_submit: {
    id: 'meter_reading_submit',
    message: 'Self Meter Reading Submission:\nPlease enter current kWh meter reading display value:',
    requiresInput: true,
    inputPlaceholder: 'e.g. 48920 kWh',
    options: [
      { id: 'mrs_d1', label: 'Submit Demo Reading (48920 kWh)', nextFlowId: 'meter_reading_ack', payload: { reading: '48920' } }
    ],
    processInput: (val) => ({ nextFlowId: 'meter_reading_ack', contextUpdates: { reading: val.trim() || '48920' } })
  },
  meter_reading_ack: {
    id: 'meter_reading_ack',
    message: (ctx) => `Self Reading Submitted Successfully!\n• Recorded Reading: ${ctx.reading || '48920'} kWh\n• Verification Status: PRE-APPROVED BY AUDIT ENGINE\n• Invoice Generation: Scheduled within 24 hours.`,
    options: [
      { id: 'mra_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CATEGORY 7: UPDATE YOUR DETAILS
  // ═════════════════════════════════════════════════════════════════════════
  update_details_start: {
    id: 'update_details_start',
    message: 'Update Your Details Portal. Select option:',
    options: [
      { id: 'ud1', label: 'E-bill Registration (Paperless Bill)', nextFlowId: 'ebill_register', variant: 'primary' },
      { id: 'ud2', label: 'Power Alert Registration (SMS & WhatsApp)', nextFlowId: 'power_alert_register' },
      { id: 'ud_b', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  ebill_register: {
    id: 'ebill_register',
    message: 'Paperless E-Bill Registration:\nPlease enter your Email Address to receive monthly PDF bills:',
    requiresInput: true,
    inputPlaceholder: 'e.g. customer@example.com',
    options: [
      { id: 'eb_d1', label: 'Use Registered Email', nextFlowId: 'ebill_ack' }
    ],
    processInput: () => ({ nextFlowId: 'ebill_ack' })
  },
  ebill_ack: {
    id: 'ebill_ack',
    message: 'E-Bill Subscription Activated!\nYou will receive official PDF invoices & payment receipts directly on your registered email address.',
    options: [
      { id: 'eba_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  power_alert_register: {
    id: 'power_alert_register',
    message: 'Power Alert SMS & WhatsApp Registration:\nPlease enter your 10-digit Mobile Number for outage & payment alerts:',
    requiresInput: true,
    inputPlaceholder: 'e.g. 9825012345',
    options: [
      { id: 'pa_d1', label: 'Use Mobile Number', nextFlowId: 'power_alert_ack' }
    ],
    processInput: () => ({ nextFlowId: 'power_alert_ack' })
  },
  power_alert_ack: {
    id: 'power_alert_ack',
    message: 'Power Alert Registration Successful!\nInstant SMS & WhatsApp alerts for scheduled maintenance, outage status, and due dates have been activated.',
    options: [
      { id: 'paa_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CATEGORY 8: SAFETY RELATED
  // ═════════════════════════════════════════════════════════════════════════
  safety_related_start: {
    id: 'safety_related_start',
    message: 'CRITICAL SAFETY DESK:\nFor electrical hazards, sparking lines, snapping conductors, or transformer fire emergencies, immediately contact Safety Emergency Response:',
    options: [
      { id: 'saf1', label: 'Report Emergency Live Wire / Electrical Hazard', nextFlowId: 'safety_hazard_report', variant: 'primary' },
      { id: 'saf2', label: 'Public Safety Operational Guidelines', nextFlowId: 'safety_guidelines' },
      { id: 'saf_b', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  safety_hazard_report: {
    id: 'safety_hazard_report',
    message: 'EMERGENCY DISPATCH INITIATED:\n• Safety Helpline: 1912 / 1800-200-1912\n• Priority Code: RED ALERT HAZARD\n• Mobile Safety Quick Response Vehicle dispatched.\n\nPlease maintain a minimum 10-meter distance from fallen wires or sparking equipment.',
    options: [
      { id: 'shr_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  safety_guidelines: {
    id: 'safety_guidelines',
    message: 'Torrent Power Public Safety Guidelines:\n1. Never touch snapped overhead lines or submerged electrical pillars.\n2. Ensure proper ELCB / RCCB circuit breakers are installed at premises.\n3. Do not construct buildings or hoardings under EHV transmission lines.\n4. Call 1912 immediately upon witnessing electrical sparking.',
    options: [
      { id: 'sg_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CATEGORY 9: THEFT REPORTING
  // ═════════════════════════════════════════════════════════════════════════
  theft_reporting_start: {
    id: 'theft_reporting_start',
    message: 'Power Theft Anonymous Reporting & Vigilance Portal:\nReport direct line hooking, meter tampering, or illegal electricity bypass. Identity of informants will remain 100% CONFIDENTIAL.',
    options: [
      { id: 'th1', label: 'Submit Anonymous Power Theft Tip-off', nextFlowId: 'theft_input', variant: 'primary' },
      { id: 'th_b', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },
  theft_input: {
    id: 'theft_input',
    message: 'Please enter location address / details of electricity theft:',
    requiresInput: true,
    inputPlaceholder: 'Type location & details...',
    options: [
      { id: 'th_demo', label: 'Submit Anonymous Tip-off (Demo)', nextFlowId: 'theft_ack' }
    ],
    processInput: () => ({ nextFlowId: 'theft_ack' })
  },
  theft_ack: {
    id: 'theft_ack',
    message: 'Vigilance Tip-off Received!\n• Reference Code: VIG-CONFIDENTIAL-2026\n• Status: FORWARDED TO ANTI-POWER THEFT SQUAD\n\nThank you for assisting Torrent Power in preventing grid losses.',
    options: [
      { id: 'th_m', label: 'Return to Main Menu', nextFlowId: 'main_menu' }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CATEGORY 10: HELPLINE NOS
  // ═════════════════════════════════════════════════════════════════════════
  helpline_nos_start: {
    id: 'helpline_nos_start',
    message: 'Official Torrent Power Helplines & Contact Directory:\n\n• 24x7 Customer Care & Outage Toll-Free: 1912 / 1800-200-1912\n• Corporate Office (Ahmedabad): +91-79-26628000\n• Surat Circle Helpline: +91-261-2400000\n• Bhiwandi Franchisee Care: 1912 / 02522-306000\n• Agra Circle Customer Care: 1912 / 0562-3060000\n• UT Dadra & Nagar Haveli, Daman: 1912\n• Official Email: connect.connect@torrentpower.com',
    options: [
      { id: 'hl_m', label: 'Return to Main Menu', nextFlowId: 'main_menu', variant: 'primary' }
    ]
  }
};
