# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Cost(models.Model):
    date = models.DateField()
    costcategory = models.CharField(max_length=20)
    costitems = models.CharField(max_length=20, blank=True, null=True)
    buyamount = models.FloatField()
    unit = models.CharField(max_length=10)
    cost = models.FloatField()
    status = models.IntegerField(blank=True, null=True, db_comment='1 is paid, 2 is due')
    buyer = models.CharField(max_length=20)
    buyvoucher = models.CharField(max_length=20)
    comment = models.CharField(max_length=50)
    logs = models.CharField(max_length=50)
    costitems_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cost'


class Costitems(models.Model):
    sector = models.IntegerField()
    costitems = models.CharField(unique=True, max_length=20)
    logs = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'costitems'


class Costpurpose(models.Model):
    costpurpose = models.CharField(unique=True, max_length=20)

    class Meta:
        managed = False
        db_table = 'costpurpose'


class Dailyworks(models.Model):
    date = models.DateField(db_column='Date')  # Field name made lowercase.
    worktype = models.CharField(max_length=20)
    item = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=5, decimal_places=0)
    unit = models.CharField(max_length=10)
    personel = models.CharField(max_length=20)
    comment = models.CharField(max_length=50)
    logs = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'dailyworks'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Earning(models.Model):
    date = models.DateField()
    sector = models.IntegerField()
    item = models.IntegerField()
    source = models.IntegerField()
    quantity_per_unit = models.FloatField()
    quantity = models.IntegerField()
    unit = models.IntegerField()
    price = models.IntegerField()
    status = models.IntegerField(blank=True, null=True, db_comment='1 is paid, 2 is pending ')
    memo = models.CharField(max_length=15)
    comment = models.CharField(max_length=30)
    logs = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'earning'


class Fishbuy(models.Model):
    date = models.DateField()
    fishname = models.CharField(max_length=20)
    buyfrom = models.CharField(max_length=50)
    buyamount = models.IntegerField()
    fishquantity = models.IntegerField()
    price = models.IntegerField()
    status = models.IntegerField(blank=True, null=True, db_comment='1 is paid, 2 is due')
    fishto = models.CharField(max_length=50)
    vouchar = models.CharField(max_length=15)
    comments = models.CharField(max_length=50)
    logs = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'fishbuy'


class Fishtype(models.Model):
    fishname = models.CharField(db_column='FishName', unique=True, max_length=20)  # Field name made lowercase.
    logs = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'fishtype'


class Investment(models.Model):
    date = models.DateField()
    name = models.CharField(max_length=20)
    amount = models.FloatField()
    comments = models.CharField(max_length=50)
    logs = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'investment'


class Items(models.Model):
    sector = models.CharField(max_length=20)
    item_name = models.CharField(unique=True, max_length=15)
    logs = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'items'


class Land(models.Model):
    gher = models.IntegerField()
    mousa = models.CharField(max_length=15)
    dag = models.CharField(max_length=20)
    khotian = models.CharField(max_length=3)
    amount = models.FloatField()
    plane_land = models.FloatField()
    par_cannel = models.FloatField()
    owners = models.CharField(max_length=200)
    comment = models.CharField(max_length=100)
    logs = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'land'


class LoanProvidersInfo(models.Model):
    investerid = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    address = models.CharField(db_column='Address', max_length=50)  # Field name made lowercase.
    mobile = models.TextField(db_column='Mobile')  # Field name made lowercase.
    refference = models.CharField(db_column='Refference', max_length=20)  # Field name made lowercase.
    logs = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'loan_providers_info'


class LoanTransactions(models.Model):
    loanid = models.IntegerField()
    investerid = models.IntegerField()
    date = models.DateField()
    payment = models.IntegerField(db_column='Payment')  # Field name made lowercase.
    voucherno = models.CharField(max_length=5)

    class Meta:
        managed = False
        db_table = 'loan_transactions'


class Loandetails(models.Model):
    loanid = models.AutoField(primary_key=True)
    investerid = models.IntegerField()
    amount = models.IntegerField()
    interestpermonth = models.DecimalField(max_digits=3, decimal_places=2)
    conditions = models.CharField(max_length=50)
    logs = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'loandetails'


class Mousa(models.Model):
    mousa = models.CharField(max_length=255, blank=True, null=True)
    dag = models.CharField(max_length=255, blank=True, null=True)
    owner = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    amount = models.FloatField(blank=True, null=True)
    term = models.CharField(max_length=255, blank=True, null=True)
    vc_numnber = models.CharField(max_length=255, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True, db_comment='1 is paid, 2 is pending ')
    log = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mousa'


class Salary(models.Model):
    date = models.DateField()
    purpose = models.CharField(max_length=20)
    reason = models.CharField(max_length=20)
    quantity = models.IntegerField()
    rate = models.IntegerField()
    total = models.IntegerField()
    personel = models.CharField(max_length=50)
    voucher = models.CharField(max_length=5)
    status = models.IntegerField(blank=True, null=True, db_comment='1 is paid, 2 is due')
    comment = models.CharField(max_length=20)
    logs = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'salary'


class Sectors(models.Model):
    sector = models.CharField(unique=True, max_length=15)
    logs = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'sectors'


class Sources(models.Model):
    source = models.CharField(max_length=20)
    logs = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'sources'


class Staff(models.Model):
    staffno = models.AutoField(db_column='staffNo', primary_key=True)  # Field name made lowercase.
    name = models.CharField(unique=True, max_length=15, blank=True, null=True)
    post = models.CharField(max_length=10)
    salary = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    address = models.CharField(max_length=30)
    mobile = models.CharField(max_length=11)
    reference = models.CharField(max_length=15)
    log = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'staff'


class Staffs(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(db_column='Name', max_length=20)  # Field name made lowercase.
    designation = models.CharField(db_column='Designation', max_length=20)  # Field name made lowercase.
    address = models.CharField(db_column='Address', max_length=30)  # Field name made lowercase.
    mobile = models.CharField(max_length=13)

    class Meta:
        managed = False
        db_table = 'staffs'


class Units(models.Model):
    id = models.IntegerField(primary_key=True)
    unit = models.CharField(max_length=10)
    logs = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'units'


class Users(models.Model):
    id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    trn_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'users'


class Usersinfo(models.Model):
    name = models.CharField(unique=True, max_length=20)
    username = models.CharField(unique=True, max_length=20)
    password = models.CharField(max_length=260)
    role = models.CharField(max_length=15)
    email = models.CharField(max_length=20)
    mobile = models.TextField()

    class Meta:
        managed = False
        db_table = 'usersinfo'
